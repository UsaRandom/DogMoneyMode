var intervalId = null;
var fiat_currency = 'usd';
var fiat_currency_symbol = "$";
var dogecoinValue = 0;



var updatePrice = function (callback) {
        
    // Get the current Unix timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    chrome.storage.sync.get(['dogecoinTimestamp', 'dogecoinValue', 'fiat_currency'], function(result) {
        const storedTimestamp = result.dogecoinTimestamp;
        dogecoinValue = result.dogecoinValue;
        let storedCurrency = result.fiat_currency;
        
        // Fetch new value if there is no stored timestamp, it's more than 120 seconds old, or the currency has changed
        if (!storedTimestamp || currentTimestamp - storedTimestamp > 120 || storedCurrency !== fiat_currency) {
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
                    callback();
                })
                .catch((error) => {
                    console.log("Much Sadness! Can't get current value of Dogecoin. " + error);
                });
        }
        else {
            
            callback();
        }
    });
}

// Function to start the interval
function startInterval() {
    chrome.storage.sync.get('autoRefresh', function(data) {
        if (data.autoRefresh) {
            // Set an interval to refresh prices every 2.5 seconds
            intervalId = setInterval(function() {
                convertPrices();
            }, 2500);
        }
    });
}

// Function to clear any existing interval
function clearPreviousInterval() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}


function convertPrices() {
    clearPreviousInterval();
    updatePrice(function() {
        
        var regex = new RegExp('\\' + fiat_currency_symbol + '\\d+(,\\d{3})*(\\.\\d+)?', 'g');
    
        /*
            Amazon breaks prices up into many elements, it gets some custom logic.
        */
        if (/^(www\.)?amazon\.[a-z\.]{2,5}$/.test(window.location.hostname)) {
            // Amazon-specific logic here
            var priceElements = document.querySelectorAll('.a-price');
            priceElements.forEach(function(priceElement) {
                if(!priceElement.textContent.includes('Ð')){
                    var offscreenElement = priceElement.querySelector('.a-offscreen');
                    var visiblePriceElements = priceElement.querySelectorAll('.a-price-whole, .a-price-fraction');
                    var currencySymbolElement = priceElement.querySelector('.a-price-symbol');

                    if (offscreenElement && visiblePriceElements.length > 0) {
                        // Remove currency symbol and commas before conversion to float
                        var fiat = offscreenElement.textContent.replace(fiat_currency_symbol, '').replace(/,/g, '');
                        var dogefy = (parseFloat(fiat) / parseFloat(dogecoinValue)).toLocaleString('en', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    });

                        offscreenElement.textContent = 'Ð' + dogefy;

                        if (currencySymbolElement) {
                            currencySymbolElement.textContent = 'Ð';
                        }

                        var [whole, fraction] = dogefy.split('.');
                        visiblePriceElements[0].textContent = whole + visiblePriceElements[0].querySelector('.a-price-decimal').textContent;
                        visiblePriceElements[1].textContent = fraction;
                    }
                }
            });


            document.querySelectorAll('span[id="sns-base-price"]').forEach(function(node) {
                var text = node.textContent;
                var matches = text.match(regex);
            
                if (matches) {
                    var newTextNode = node.cloneNode(); // clone the node to avoid modifying the original while iterating
                    for (var i = 0; i < matches.length; i++) {
                        // Adjust the fiat extraction pattern to include commas
                        var fiat = matches[i].match(/[\d,\.]+/)[0];
            
                        // Remove commas before converting to float
                        var fiatValue = parseFloat(fiat.replace(/,/g, ''));
            
                        var dogefy = text.replace(fiat_currency_symbol + fiat, 'Ð' + (fiatValue / parseFloat(dogecoinValue)).toLocaleString('en', {
                                                                                                                            minimumFractionDigits: 2,
                                                                                                                            maximumFractionDigits: 2
                                                                                                                        }));
                        text = dogefy;
                    }
                    newTextNode.textContent = text;
                    node.parentNode.replaceChild(newTextNode, node); // replace the old node with the new one
                }
            });
            
        }     


        /*

        This logic replaces most fiat prices on the web.

        */

        document.querySelectorAll('*').forEach(function(node) {
            var isEligibleNode = node.children.length === 0; // Process leaf nodes
        
            if (!isEligibleNode && node.children.length > 0) { // Check for nodes with only children but no grandchildren
                isEligibleNode = Array.from(node.children).every(function(child) {
                    return !child.children.length && (child.tagName.toLowerCase() === 'br' || child.tagName.toLowerCase() === 'span');
                });
            }
        
            if (isEligibleNode) { 
                var text = node.innerHTML; 
                var matches = text.match(regex);
        
                if (matches) {
                    var newTextNode = node.cloneNode(); // Clone the node to avoid modifying the original while iterating
        
                    for (var i = 0; i < matches.length; i++) {
                        // Adjust the fiat extraction pattern to include commas
                        var fiat = matches[i].match(/[\d,\.]+/)[0];
        
                        // Remove commas before converting to float
                        var fiatValue = parseFloat(fiat.replace(/,/g, ''));
        
                        var dogefy = text.replace(fiat_currency_symbol + fiat, 'Ð' + (fiatValue / parseFloat(dogecoinValue)).toLocaleString('en', {
                                                                                                                                minimumFractionDigits: 2,
                                                                                                                                maximumFractionDigits: 2
                                                                                                                            }));
                        text = dogefy;
                    }
        
                    newTextNode.innerHTML = text;
                    node.parentNode.replaceChild(newTextNode, node); // Replace the old node with the new one
                }
            }
        });
        
        

        
    });
    startInterval();

}

// Load the current currency from storage
chrome.storage.sync.get(['fiat_currency', 'fiat_currency_symbol'], function(items) {
    fiat_currency = items.fiat_currency || 'usd'; // Default to USD if not set
    fiat_currency_symbol = items.fiat_currency_symbol || '$'; // Default to $ if not set
    dogecoinValue = 0;


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action == "runScript") {
            convertPrices();
        }
    });
    
    startInterval();
});
