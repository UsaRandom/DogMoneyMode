document.getElementById('run').addEventListener('click', function() {
  notifyConvertPrices();
});

var fiat_currency = 'usd';
var fiat_currency_symbol = '$';
var dogecoinValue = 0;

document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.sync.get(['dogecoinValue', 'fiat_currency', 'fiat_currency_symbol'], function(result) {
    dogecoinValue = result.dogecoinValue ?? 0;
    fiat_currency = result.fiat_currency ?? 'usd';
    fiat_currency_symbol = result.fiat_currency_symbol ?? '$';
    
    document.getElementById('fiat-price').innerHTML = fiat_currency_symbol + ' ' + dogecoinValue.toFixed(3);
  });


  chrome.storage.sync.get(['dogeAutoRefresh'], function(result) {
    document.getElementById("auto-refresh").checked = result.dogeAutoRefresh || false;
    document.getElementById("auto-refresh").addEventListener("change", function(e) {
      chrome.storage.sync.set({'dogeAutoRefresh': e.target.checked}, function() {
          notifyAutoChanged();
      });
    });
  });


  chrome.storage.sync.get(['fiat_currency', 'fiat_currency_symbol'], function(items) {
    if (items.fiat_currency && items.fiat_currency_symbol) {
      fiat_currency = items.fiat_currency;
      fiat_currency_symbol = items.fiat_currency_symbol;

      select.value = items.fiat_currency + ',' + items.fiat_currency_symbol;
      updatePrice();
    }
  });


  var select = document.getElementById('currency-select');

  select.addEventListener('change', function() {
    var [selected_fiat_currency, selected_fiat_currency_symbol] = select.value.split(',');
    fiat_currency = selected_fiat_currency;
    fiat_currency_symbol = selected_fiat_currency_symbol;
    
    chrome.storage.sync.set({
      fiat_currency: fiat_currency,
      fiat_currency_symbol: fiat_currency_symbol
    });
    forceUpdatePrice();  
  });

  updatePrice();
});



function notifyConvertPrices() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "convertPrices",
      currencySymbol: fiat_currency_symbol,
      conversionPrice: dogecoinValue,
      currencyCode: fiat_currency
    });
  });

}

function notifyAutoChanged() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "autoChanged"
    });
  });
}



function forceUpdatePrice() {
  chrome.runtime.sendMessage({command: "forceUpdatePrice"},function(response) {
    dogecoinValue = response.dogecoinValue;
    document.getElementById('fiat-price').innerHTML = fiat_currency_symbol + ' ' + dogecoinValue.toFixed(3);
  });
}

function updatePrice() {
  notifyUpdatePrice(function(response) {
    dogecoinValue = response.dogecoinValue;
    document.getElementById('fiat-price').innerHTML = fiat_currency_symbol + ' ' + dogecoinValue.toFixed(3);
  });
}

function notifyUpdatePrice(callback) {
  chrome.runtime.sendMessage({command: "updatePrice"}, callback);  
}


