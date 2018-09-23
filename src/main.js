'use strict';

const Inventory = (function() {
  return {
    get() {
      return new Promise(async (resolve, reject) => {
        let result = [];
        for (let key in App.deployedContracts) {
          console.log(1);
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

(function($, _) {
  DisplayCards($, _);
}) (jQuery, _);
