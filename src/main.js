'use strict';

const GAS = 3000000;

const Inventory = (function() {
  return {
    get() {
      return new Promise(async (resolve, reject) => {
        let result = [];
        for (let key in App.deployedContracts) {
          let contract = App.deployedContracts[key];
          result.push({
            name: key,
            tokenAddress: contract.address,
            available: contract.address in App.AmountByToken ? App.AmountByToken[contract.address] : 0,
            price: App.mock[key]['price'],
            dailyVol: App.mock[key]['dailyVol'],
            shortInterest: App.mock[key]['shortInterest'],
            initMargin: App.mock[key]['initMargin'],
            minMargin: App.mock[key]['minMargin'],
            dailyLendingRate: App.mock[key]['dailyLendingRate'],
            dailyLendVol: App.mock[key]['dailyLendVol'],
          });
        }
        resolve(result);
      });
    },
  };
})();

const DisplayCards = function($, _) {
  $('.inventory').empty();
  Inventory.get().then((inventoryCards) => {
    _.forEach(inventoryCards, card => {
      $('.inventory').append(tpl.inventoryCard(card));
    });
  });
};

const DisplaySummary = function($, _) {
  $.ajax({
    type: "GET",
    url: MATCHER_URL + '/shortseller_info?shortseller=' + App.account,
    data: {},
  }).always(function(data) {
      let summaryContainer = $('div.spotnet-container');
      log("data['totalBalance'] "+data['totalBalance']);
      summaryContainer.find('span.totalBalance').text(data['totalBalance']);
      summaryContainer.find('span.availableBalance').text(data['availableBalance']);
      summaryContainer.find('span.lendingFeesOwed').text(data['lendingFeesOwed']);
      summaryContainer.find('span.unrealizedNetPnL').text(data['unrealizedNetPnL']);
      summaryContainer.find('span.marginRequired').text(data['marginRequired']);
      summaryContainer.find('span.buyingPower').text(data['buyingPower']);
      summaryContainer.find('span.collateralPct').text(data['collateralPct']);
      summaryContainer.find('span.openPositionsValue').text(data['openPositionsValue']);
      // DisplayCards($, _);
  });
};


// const sign = function(text) {
//   log(App.account);
//   log(text);
//   let sha = web3.sha3(text);
//   log(web3.provider);
//   // Need to wrap  in a Promise due to this: 
//   // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#dizzy-all-async---think-of-metamask-as-a-light-client
//   return new Promise(resolve => { 
//     web3.eth.sign(App.account, sha, sig => {
//       let r = sig.slice(0, 66);
//       let s = "0x" + sig.slice(66, 130);
//       let v = parseInt(sig.slice(130, 132), 16);
//       return [r, s, v];
//     });
//   });
// };

const sign = function(msgParams) {
  // web3.eth.signTypedData(msgParams, App.account).then(console.log);
  return new Promise((resolve, reject) => { 
    web3.currentProvider.sendAsync({
      method: 'eth_signTypedData',
      params: [msgParams, App.account],
      from: App.account,
    }, function (err, result) {
      if (err) {
        reject(err);
        return;
      }
      if (result.error) {
        reject(result.error.message);
        return;
      }
      let sig = result.result;
      let r = sig.slice(0, 66);
      let s = "0x" + sig.slice(66, 130);
      let v = parseInt(sig.slice(130, 132), 16);
      log([r, s, v]);
      resolve([r, s, v]);
    });
  });
};

(async function($, _) {
  const spotArtifact = await $.get('http://localhost/Spot.json');
  let spotContract = TruffleContract(spotArtifact);
  spotContract.setProvider(web3.currentProvider); 
  let deployedSpot;
  spotContract.deployed().then(function(inst) {
    deployedSpot = inst;
  });

  $('.tab-pane').on('click', 'button.deposit', deposit);
  function deposit(event) {
    event.preventDefault();
    let transfers = $(event.target).parents('#transfers');
    let $transferInput = transfers.find('input#transfer-amount');
    let transfer_amt = parseInt($transferInput.val());
    if (isNaN(transfer_amt)) {
      console.log(transfer_amt+' is not a number');
      $transferInput.val('');
      return false;
    }
    let depositModal = $(event.target).parents('body').find('div#deposit-modal');
    depositModal.find('span.deposit-modal-title').text(transfer_amt);
    depositModal.find('span.totalBalance').text('1');
    depositModal.find('span.availableBalance').text('2');
    depositModal.find('span.buyingPower').text('3');
    depositModal.find('span.collateral').text('4');
  }
  $('div#deposit-modal').on('click', 'button.confirmDeposit', depositConfirm);  
  function depositConfirm(event) { 
    let $transferInput = $("body").find('input#transfer-amount');
    let transfer_amt = parseInt($transferInput.val());  
    shortsellerDeposit(App.account, transfer_amt);
  }
  async function shortsellerDeposit(shortseller, amount) {
    // TODO: Secure the logic that determines the index
    let shortsellers = await deployedSpot.getShortsellers();
    let shortsellersMap = shortsellers.reduce(function(result, item, index, array) {
      result[item] = index; 
      return result;
    }, {});
    let idx = shortseller in shortsellersMap ? shortsellersMap[shortseller] : -1;
    $('body').find('div#deposit-confirmation-modal').modal();
    deployedSpot.shortsellerDeposit(
      idx, 
      {from: shortseller, value: amount, gas: GAS}
    ).then(data=> {
      log(data);
      DisplaySummary($, _);
    }).catch(e=> console.log("error depositing: "+e));
  }
  
  $('.tab-pane').on('click', 'button.withdraw', withdraw);
  function withdraw(event) {
    event.preventDefault();
    let transfers = $(event.target).parents('#transfers');
    let $transferInput = transfers.find('input[id="transfer-amount"]');
    let transfer_amt = parseInt($transferInput.val());
    console.log('transfer_amt '+transfer_amt);
    if (isNaN(transfer_amt)) {
      console.log(transfer_amt+' is not a number');
      $transferInput.val('');
      return false;
    }
    let withdrawModal = $(event.target).parents('body').find('div#withdraw-modal');
    let $modalTitle = withdrawModal.find('span[class="withdraw-modal-title"]');
    $modalTitle.text(transfer_amt);
    withdrawModal.find('span.withdraw-modal-title').text(transfer_amt);
    withdrawModal.find('span.totalBalance').text('1');
    withdrawModal.find('span.availableBalance').text('2');
    withdrawModal.find('span.buyingPower').text('3');
    withdrawModal.find('span.collateral').text('4');
  }
  $('div#withdraw-modal').on('click', 'button.confirmWithdraw', withdrawConfirm); 
  async function withdrawConfirm(event) { 
    let $transferInput = $("body").find('input#transfer-amount');
    let transfer_amt = parseInt($transferInput.val());
    let sig;
    sig = await sign([
      {
        type: 'address',      // Any valid solidity type
        name: 'Shortseller',  // Any string label you want
        value: App.account    // The value to sign
      },
      {
        type: 'uint',
        name: 'Withdrawal amount',
        value: transfer_amt
      },
    ]);
    $.ajax({
      type: "POST",
      url: MATCHER_URL + '/shortseller_withdraw/' + App.account,
      data: {
        'amount':           transfer_amt,
        'shortseller_rsv':  sig,
      },
    }).then(data => {
        $(event.target).parents('body').find('div#withdraw-confirmation-modal').modal();
        DisplayCards($, _);
    }).catch(e => {
      console.log(e);
    });
  }
}) (jQuery, _);
