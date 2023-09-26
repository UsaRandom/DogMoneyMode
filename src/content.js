import { Currency } from './Utilities';

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

    // Start processing at the body tag
    processNodesRecursively(document.body);
}





function processNodesRecursively(node) {

    // If this node is an input field or contenteditable, skip processing
    if (node.tagName && node.tagName.toLowerCase() === 'input') return;
    if (node.isContentEditable) return;


    // If this node has children, recursively process the children first
    if (node.childNodes.length > 0) {
        Array.from(node.childNodes).forEach(child => processNodesRecursively(child));
    }
    else {
        let result = processMatches(node.textContent);
        if (result.replaced) {
            node.textContent = result.text;
        }
    }
}
  



function processMatches(text) {

    let replaced = false;
    let currencyToUse = Currency.getCurrencyBySymbol(text);
    let regexToMatch = Currency.getCurrencyRegex(currencyToUse);

    if(!currencyToUse || !regexToMatch){
        return {text, replaced};
    }

    while (true) {
        var matches = text.match(regexToMatch);
        if (!matches) break; // exit the loop if no more matches
    
        // find the longest match
        var longestMatch = matches.reduce(function(a, b) { return a.length > b.length ? a : b; });
        

        if(longestMatch.length === 1){
            break;
        }

        // process the longest match
        var dogecoinAmount = convertToDogecoin(currencyToUse, longestMatch, regexToMatch);
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



function convertToDogecoin(currencyToUse, currencyStr, regexToMatch) {
    
    //if we don't clone the regex we can have issues
    const match = new RegExp(regexToMatch.source, regexToMatch.flags).exec(currencyStr);
    
    if (!match) {
        return null; // not a valid currency string
    }

    let matchIndex = 2;

    if([Currency.CNY, Currency.JPY].indexOf(currencyToUse) > -1) {
        matchIndex = 1;
    }

    // Remove the currency symbol, spaces, and commas, then parse as a float
    const valueInCurrency = parseFloat(match[matchIndex].replace(/[, ]/g, ''));


    // Convert to Dogecoin
    return valueInCurrency / exchangeRates[currencyToUse];
}