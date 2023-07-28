chrome.alarms.create('updatePrice', {periodInMinutes: 2});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updatePrice') {
    updatePrice(false).then(() => {
      console.log('Price updated');
    });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "updatePrice") {
      updatePrice(false).then(result => sendResponse(result))
                   .catch(error => sendResponse({error: error.message}));
      return true;
    }
    if (request.command === "forceUpdatePrice") {
        updatePrice(true).then(result => sendResponse(result))
                   .catch(error => sendResponse({error: error.message}));
      return true;
    }
  });

function updatePrice(forceIt) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['dogecoinTimestamp', 'dogecoinValue', 'fiat_currency', 'fiat_currency_symbol'], function(result) {
        let storedTimestamp = result.dogecoinTimestamp;
        let dogecoinValue = result.dogecoinValue ?? 0;
        let fiat_currency = result.fiat_currency ?? 'usd';
        let fiat_currency_symbol = result.fiat_currency_symbol ?? '$';
  
        if (forceIt || dogecoinValue === 0 || !storedTimestamp || currentTimestamp - storedTimestamp > 120) {
          fetch("https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=" + fiat_currency)
            .then(response => response.json())
            .then(data => {
              dogecoinValue = data["dogecoin"][fiat_currency];
              chrome.storage.sync.set({
                'dogecoinValue': dogecoinValue,
                'fiat_currency': fiat_currency,
                'dogecoinTimestamp': currentTimestamp,
                'fiat_currency_symbol': fiat_currency_symbol
              }, function() {
                resolve({
                  'dogecoinValue': dogecoinValue,
                  'fiat_currency': fiat_currency,
                  'dogecoinTimestamp': currentTimestamp,
                  'fiat_currency_symbol': fiat_currency_symbol
                });
              });
            })
            .catch((error) => {
              reject(error);
              console.log("Much Sadness! Can't get current value of Dogecoin. " + error);
            });
        }
        else {
          resolve({
            'dogecoinValue': dogecoinValue,
            'fiat_currency': fiat_currency,
            'dogecoinTimestamp': currentTimestamp,
            'fiat_currency_symbol': fiat_currency_symbol
          });
        }
      });
    });
  }
  