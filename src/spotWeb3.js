// const MATCHER_URL = 'http://34.237.232.200:3001';
const MATCHER_URL = 'http://localhost:3001';

let App = {
  web3Provider: null,
  deployedContracts: {'EOS':''}, 
  contractsByAddress: {},
  account: 0x0,
  vaultDeployed: null, 
  TradersTokens: {}, 
  LendersTokens: {},
  AmountByToken: {},
  mock: {
    'EOS': {
      price: '$17.33 USD',
      dailyVol: '81,765,392',
      shortInterest: '< 8%',
      initMargin: '65%',
      minMargin: '15%',
      dailyLendingRate: '0.5%',
      dailyLendVol: '15M',    
    },
    'OMG': {
      price: '$16.78 USD',
      dailyVol: '2,640,348',
      shortInterest: '< 6%',
      initMargin: '50%',
      minMargin: '18%',
      dailyLendingRate: '1.1%',
      dailyLendVol: '0.9M',    
    },
    'BNB': {
      price: '$13.80 USD',
      dailyVol: '6,263,875',
      shortInterest: '< 11%',
      initMargin: '55%',
      minMargin: '5%',
      dailyLendingRate: '0.3%',
      dailyLendVol: '1.3M',    
    },
    'TRX': {
      price: '$0.08877 USD',
      dailyVol: '4,464,839,243',
      shortInterest: '< 7%',
      initMargin: '90%',
      minMargin: '15%',
      dailyLendingRate: '2.0%',
      dailyLendVol: '3.9M',    
    },
  },

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      $('div.instructions').show();
      return;
    }
    web3 = new Web3(App.web3Provider);

    web3.eth.getCoinbase(function(err, account) {
      if(err === null && account) {
        App.account = account;
        $('div.account_id').text(App.account);
        let acctHref = $('a.account_id').attr("href");
        $('a.account_id').attr("href", acctHref + App.account);
        return App.initContracts();
      }
      else {
        $('div.instructions').show();
      }
    });
  },

  initContracts: async function() {
    console.log(0);
    // Initialize vault 
    let vaultArtifact = await $.ajax({
      url: MATCHER_URL + '/contracts/Spot'
    });
    console.log(vaultArtifact);
    let vaultContract = TruffleContract(vaultArtifact);
    vaultContract.setProvider(App.web3Provider);
    App.vaultDeployed = await vaultContract.deployed();

    console.log(2);
    let traders = await App.vaultDeployed.getTraders();
    let tokens = await App.vaultDeployed.getTokens();
    console.log(3);
    traders.forEach(async function (t, i) {
    console.log(4);
      App.TradersTokens[t+tokens[i]]=i;
      let lenders = await App.vaultDeployed.getLenders(i);
      lenders.forEach(function (l, j) {
    console.log(5);
        if (l+tokens[i] in App.LendersTokens) {
          App.LendersTokens[l+tokens[i]].push([i,j]);
        }
        else {
          App.LendersTokens[l+tokens[i]]=[[i,j]];
        }
      });
    });
    console.log(3);

    App.AmountByToken = await $.ajax({
      url: MATCHER_URL + '/inventory_by_token/lender'
    });
    console.log(4);

    $.ajax({
      url: MATCHER_URL + '/tokens/',
      success: async function( data ) {
        for(let contract in data) {
          let tokenArtifact = data[contract];
          // get the contract artifact file and use it to instantiate a truffle contract abstraction
          let tokenContract = TruffleContract(tokenArtifact);
          // set the provider for our contracts
          tokenContract.setProvider(App.web3Provider);
          // Save instance
          let deployedContract = await tokenContract.deployed();
          deployedContract.name = tokenArtifact.contractName;
          App.deployedContracts[tokenArtifact.contractName] = deployedContract;
          App.contractsByAddress[deployedContract.address] = deployedContract;
        };
        DisplayCards(jQuery, _);
      },
    });
    console.log(5);
  },


  // // approve: async function(token, amount) {
  // //   balance = await App.contracts[token].balanceOf(App.account);
  // //   if (balance.toNumber() >= parseInt(amount)) {
  // //     App.contracts[token].approve(
  // //       App.spot.address, 
  // //       amount,
  // //       {from: App.account}
  // //     ).catch(function(err) {
  // //       console.log("Error approving " + err);
  // //     });
  // //   }
  // //   else {
  // //     console.log("balance not enough " + balance + " need " + amount);
  // //   }
  // // },

  // sign: async function(text) {
  //   log(App.account);
  //   log(text);
  //   let sha = web3.sha3(text);
  //   // log(sha);
  //   web3.eth.sign(App.account, sha, async function(err, sig) {
  //     if(err !== null) {
  //       log(err);
  //       return;
  //     }
  //     let r = sig.slice(0, 66);
  //     let s = "0x" + sig.slice(66, 130);
  //     let v = parseInt(sig.slice(130, 132), 16);
  //     resp = await App.spot.testSign(sha, v, r, s);
  //     log(resp);
  //   });
  // },

};

App.init();

function log(s) {
  console.log(s);
};