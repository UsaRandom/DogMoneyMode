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

    let replaced = false;

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
  
import { AmazonPriceReplacer } from './websites/AmazonPriceReplacer';
import { NewEggPriceReplacer } from './websites/NewEggPriceReplacer';

let websitePriceReplacers = [];

websitePriceReplacers.push(new AmazonPriceReplacer());
websitePriceReplacers.push(new NewEggPriceReplacer());


import { AppStateStore } from './AppStateStore';
import { ExchangeRateStore } from './ExchangeRateStore';

const updateSpeed = 500;

const appStateStore = new AppStateStore();
const exchangeRateStore = new ExchangeRateStore();

let state = appStateStore.getAppState();
let exchangeRates = exchangeRateStore.getRates();

let updateInterval = null;


(async function update() {
    try {
        clearInterval(updateInterval);

        let oldState = state;
        state = await appStateStore.getAppState();

        if(state.dogMoneyModeEnabled) {
            exchangeRates = await exchangeRateStore.getRates();
            dogecoinValue = exchangeRates.usd;
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

        updateInterval = setInterval(update, updateSpeed);
    } catch (error) {
        console.error(error);
    }
})();



function convertPrices() {

    websitePriceReplacers.forEach(priceReplacer => {
        priceReplacer.replace(exchangeRates);
    });

    var regex = createCurrencyRegex(fiat_currency_symbol);

    // Start processing at the body tag
    processNodesRecursively(document.body, regex);
}
