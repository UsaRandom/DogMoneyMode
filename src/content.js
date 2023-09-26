const fiat_currency_symbol = "$";
let dogecoinValue = 0.0774;


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
            var fractionDigitsOptions = {};

            if (dogecoinAmount < 1) {
                //dogecoin did a thing, show 3 decimal points
                fractionDigitsOptions.minimumFractionDigits = 3;
                fractionDigitsOptions.maximumFractionDigits = 3;
            }
            else if (dogecoinAmount < 100) {
                //only show decimal points if we have less than 100
                fractionDigitsOptions.minimumFractionDigits = 2;
                fractionDigitsOptions.maximumFractionDigits = 2;
            }
            else {
                fractionDigitsOptions.minimumFractionDigits = 0;
                fractionDigitsOptions.maximumFractionDigits = 0;
            }
            
            let index = text.indexOf(longestMatch);
            if (index > 0 && text.charAt(index - 1) === '-') {
                text = text.replace(longestMatch, ` Ð${dogecoinAmount.toLocaleString('en-US', fractionDigitsOptions)}`);
            } else {
                text = text.replace(longestMatch, `Ð${dogecoinAmount.toLocaleString('en-US', fractionDigitsOptions)}`);
            }
            
            replaced = true;
        }

    }

    return {text, replaced};
}



function processNodesRecursively(node, regexToMatch) {

    // If this node is an input field or contenteditable, skip processing
    if (node.tagName && node.tagName.toLowerCase() === 'input') return;
    if (node.isContentEditable) return;


    // If this node has children, recursively process the children first
    if (node.childNodes.length > 0) {
        Array.from(node.childNodes).forEach(child => processNodesRecursively(child, regexToMatch));
    }
    else {
        let result = processMatches(node.textContent, regexToMatch);
        if (result.replaced) {
            node.textContent = result.text;
        }
    }
}
  
function convertPrices() {
    var regex = createCurrencyRegex(fiat_currency_symbol);

    /*
        Amazon breaks prices up into many elements, it gets some custom logic.
    */
    if (/^(www\.)?amazon\.[a-z\.]{2,5}$/.test(window.location.hostname)) {
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

    /* 
        Newegg also breaks up prices into many elements, it also gets custom logic.
    */
   if (/^(www\.)?newegg\.[a-z\.]{2,5}$/.test(window.location.hostname)) {
        var priceElements = document.querySelectorAll('.price-current');
        var goodsPriceElements = document.querySelectorAll('.goods-price-current');
    
        priceElements.forEach(function(priceElement) {
            if(!priceElement.textContent.includes('Ð')){
                var strongElement = priceElement.querySelector('strong');
                var supElement = priceElement.querySelector('sup');
                var dollarSymbolIndex = Array.from(priceElement.childNodes).findIndex(node => node.nodeType === 3 && node.nodeValue.includes('$'));
        
                if (strongElement && supElement && dollarSymbolIndex > -1) {
                    var fiat = strongElement.textContent.replace(/,/g, '') + '.' + supElement.textContent.replace(/,/g, '');
                    var dogefy = (parseFloat(fiat) / parseFloat(dogecoinValue)).toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
        
                    var [whole, fraction] = dogefy.split('.');
                    strongElement.textContent = whole;
                    supElement.textContent = fraction;
                    
                    var textNode = priceElement.childNodes[dollarSymbolIndex];
                    textNode.nodeValue = textNode.nodeValue.replace(fiat_currency_symbol, 'Ð');
                }
            }
        });


        goodsPriceElements.forEach(function(priceElement) {
            if(!priceElement.textContent.includes('Ð')){
                var strongElement = priceElement.querySelector('.goods-price-value strong');
                var supElement = priceElement.querySelector('.goods-price-value sup');
                var currencySymbolElement = priceElement.querySelector('.goods-price-symbol');

                if (strongElement && supElement) {
                    var fiat = strongElement.textContent.replace(/,/g, '') + '.' + supElement.textContent.replace(/,/g, '');
                    var dogefy = (parseFloat(fiat) / parseFloat(dogecoinValue)).toLocaleString('en', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    var [whole, fraction] = dogefy.split('.');
                    strongElement.textContent = whole;
                    supElement.textContent = fraction;

                    if (currencySymbolElement) {
                        currencySymbolElement.textContent = 'Ð';
                    }
                }            
            }
        });
    }
    

    // Start processing at the body tag
    processNodesRecursively(document.body, regex);
}




import { AppStateStore } from './AppStateStore';
import { ExchangeRateStore } from './ExchangeRateStore';

const updateSpeed = 500;

const appStateStore = new AppStateStore();
const exchangeRateStore = new ExchangeRateStore();

let state = appStateStore.getAppState();
let rates = exchangeRateStore.getRates();

let updateInterval = null;


function update() {
    clearInterval(updateInterval);

    let oldState = state;
    state = appStateStore.getAppState();

    if(state.dogMoneyModeEnabled) {
        rates = exchangeRateStore.getRates();
        dogecoinValue = rates.USD;
        convertPrices();
    } else if(oldState.dogMoneyModeEnabled) {
        location.reload();
    }
    
    if (state.comicSansModeEnabled) {
        document.documentElement.classList.add("dogmoneymode-comic-sans");
    }
    else {
        document.documentElement.classList.remove("dogmoneymode-comic-sans");
    }

    updateInterval = setInterval(updateView, updateSpeed);
}


update();