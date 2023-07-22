document.getElementById('run').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "runScript"});
    });
  });
  
  var fiat_currency = 'usd';
  var fiat_currency_symbol = '$';
  var dogecoinValue = 0;

  document.addEventListener('DOMContentLoaded', function() {
    var select = document.getElementById('currency-select');


      // Auto-refresh button
    chrome.storage.sync.get(['autoRefresh'], function(result) {
        document.getElementById("auto-refresh").checked = result.autoRefresh || false;
            
        document.getElementById("auto-refresh").addEventListener("change", function(e) {
          chrome.storage.sync.set({'autoRefresh': e.target.checked}, function() {
              console.log('Auto refresh is set to ' + e.target.checked);
              
              // If autoRefresh is enabled, send the "runScript" message.
              if(e.target.checked) {
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                      chrome.tabs.sendMessage(tabs[0].id, {action: "runScript"});
                  });
              }
          });
      });
      
        
    });


    var updatePrice = function () {
        
        // Get the current Unix timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);

        chrome.storage.sync.get(['dogecoinTimestamp', 'dogecoinValue', 'fiat_currency'], function(result) {
            const storedTimestamp = result.dogecoinTimestamp;
            dogecoinValue = result.dogecoinValue ?? 0;
            let storedCurrency = result.fiat_currency;
            
                                    
            let formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: fiat_currency,
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            });

            document.getElementById("fiat-price").textContent = formatter.format(dogecoinValue);


            // Fetch new value if there is no stored timestamp, it's more than 120 seconds old, or the currency has changed
            if (dogecoinValue === 0 || !storedTimestamp || currentTimestamp - storedTimestamp > 120 || storedCurrency !== fiat_currency) {
                fetch("https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=" + fiat_currency)
                    .then(response => response.json())
                    .then(data => {
                        dogecoinValue = data["dogecoin"][fiat_currency];
                        chrome.storage.sync.set({
                            'dogecoinValue': dogecoinValue, 
                            'fiat_currency': fiat_currency
                        }, function() {
                            console.log('Dogecoin value is set to ' + dogecoinValue + ' ' + fiat_currency);
                        });

                        // Store the current timestamp
                        chrome.storage.sync.set({'dogecoinTimestamp': currentTimestamp}, function() {
                            console.log('Timestamp is set to ' + currentTimestamp);
                        });

                                    
                        let formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: fiat_currency,
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4
                        });

                        document.getElementById("fiat-price").textContent = formatter.format(dogecoinValue);
                    })
                    .catch((error) => {
                        console.log("Much Sadness! Can't get current value of Dogecoin. " + error);
                    });
            }


        
        });
    }

    // Load the current currency from storage
    chrome.storage.sync.get(['fiat_currency', 'fiat_currency_symbol'], function(items) {
      if (items.fiat_currency && items.fiat_currency_symbol) {

        fiat_currency = items.fiat_currency;
        fiat_currency_symbol = items.fiat_currency_symbol;

        select.value = items.fiat_currency + ',' + items.fiat_currency_symbol;
        updatePrice();
      }
    });
  
  
    // Update the currency in storage whenever the selection changes
    select.addEventListener('change', function() {
      var [selected_fiat_currency, selected_fiat_currency_symbol] = select.value.split(',');

      fiat_currency = selected_fiat_currency;
      fiat_currency_symbol = selected_fiat_currency_symbol;
      updatePrice();
      chrome.storage.sync.set({
        fiat_currency: fiat_currency,
        fiat_currency_symbol: fiat_currency_symbol
      });
    });

    updatePrice();
  });
  