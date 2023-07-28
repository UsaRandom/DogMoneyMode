var fiat_currency = 'usd';
var fiat_currency_symbol = "$";
var dogecoinValue = 0.0774;
var updateSpeed = 500;

function convertToDogecoin(currencyStr, regexToMatch, conversionRate) {
    
    //if we don't clone the regex we can have issues
    const match = new RegExp(regexToMatch.source, regexToMatch.flags).exec(currencyStr);
    
    if (!match) {
        return null; // not a valid currency string
    }

    // Remove the currency symbol, spaces, and commas, then parse as a float
    const valueInCurrency = parseFloat(match[2].replace(/[, ]/g, ''));


    // Convert to Dogecoin
    return valueInCurrency / conversionRate;
}

function createCurrencyRegex(currencySymbol) {
    // Escape the currency symbol to handle special characters in regex
    const escapedSymbol = currencySymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create the regex pattern
    const regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;

    // Return the regex object
    return new RegExp(regexPattern);
}


function processMatches(text, regexToMatch) {

    replaced = false;

    while (true) {
        var matches = text.match(regexToMatch);
        if (!matches) break; // exit the loop if no more matches
    
        // find the longest match
        var longestMatch = matches.reduce(function(a, b) { return a.length > b.length ? a : b; });
        

        if(longestMatch.length === 1){
            break;
        }

        // process the longest match
        var dogecoinAmount = convertToDogecoin(longestMatch, regexToMatch, dogecoinValue);
        if (dogecoinAmount !== null) {
            text = text.replace(longestMatch, `Ð${dogecoinAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 })}`);
            replaced = true;
        }
    }

    return {text, replaced};
}


/*

This logic replaces most fiat prices on the web.

*/

function processNodesRecursively(node, regexToMatch, isAmazon) {

    // If this node has children, recursively process the children first
    if (node.children.length > 0) {
        Array.from(node.children).forEach(child => processNodesRecursively(child, regexToMatch, isAmazon));
    }
    
    // Determine if this node is eligible for processing
    var isEligibleNode = node.children.length === 0; // Process leaf nodes
    var onlyDecorations = false;

    if (!isEligibleNode && node.children.length > 0) { // Check for nodes with only children but no grandchildren
        isEligibleNode = Array.from(node.children).every(function(child) {
            return !child.children.length;
        });

        onlyDecorations = Array.from(node.children).every(function(child) {
            return ['em', 'strong', 'i'].includes(child.tagName.toLowerCase());
        });
    }


    if(isEligibleNode) {
        let result;

        if(node.children.length > 0 || isAmazon){
            if(onlyDecorations && !isAmazon) {
                result = processMatches(node.textContent, regexToMatch);
                if (result.replaced) {
                    node.textContent = result.text;
                }
            } else {
                result = processMatches(node.innerHTML, regexToMatch);
                if (result.replaced) {
                    node.innerHTML = result.text;
                }
            }
        } else {
            result = processMatches(node.textContent, regexToMatch);
            if (result.replaced) {
                node.textContent = result.text;
            }
        }
    }
}
  
function convertPrices() {
    var regex = createCurrencyRegex(fiat_currency_symbol);

    var isAmazon = false;

    /*
        Amazon breaks prices up into many elements, it gets some custom logic.
    */
    if (/^(www\.)?amazon\.[a-z\.]{2,5}$/.test(window.location.hostname)) {
        isAmazon = true;
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

    }

    // Start processing at the body tag
    processNodesRecursively(document.body, regex, isAmazon);
}







var autoDoge = false;
var autoDogeInterval = null;



function runAutoDoge() {
    clearInterval(autoDogeInterval);

    if(autoDoge) {
        convertPrices();
        autoDogeInterval = setInterval(runAutoDoge, updateSpeed);
    }
}

function autoChanged(firstRun) {
    chrome.runtime.sendMessage({command: "updatePrice"}).then(response => {
        if(response.error) {
          console.log("An error occurred: " + response.error);
          return;
        }
      
        dogecoinValue = response.dogecoinValue;
        fiat_currency = response.fiat_currency ?? 'usd';
        fiat_currency_symbol = response.fiat_currency_symbol ?? '$';
        
        return chrome.storage.sync.get(['dogeAutoRefresh']);
      }).then(result => {
        autoDoge = result.dogeAutoRefresh || false;

        if(!firstRun && !autoDoge)
        {
            clearInterval(autoDogeInterval);
            window.location.reload();
        }
        runAutoDoge();
      }).catch(error => console.log('An error occurred:', error));
      
  }

  
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "convertPrices") {
      // Use incoming message data
      fiat_currency_symbol = request.currencySymbol;
      dogecoinValue = request.conversionPrice;
      fiat_currency = request.currencyCode;
  
      convertPrices();
    }
    if(request.action == "autoChanged") {
        autoChanged(false);
    };
  });


  autoChanged(true);