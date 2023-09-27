import { Currency } from '../Utilities'

class GenericPriceReplacer {

    constructor() {
        this.exchangeRates = null;
    }




    replace(windowObj, node, exchangeRates) {

        this.exchangeRates = exchangeRates;

        // If this node is an input field or contenteditable, skip processing
        if (node.tagName && node.tagName.toLowerCase() === 'input') return;
        if (node.isContentEditable) return;
    
    
        // If this node has children, recursively process the children first
        if (node.childNodes && node.childNodes.length > 0) {
            Array.from(node.childNodes).forEach(child =>  this.replace(windowObj, child, exchangeRates));
        }
        else {
            let result = this.processMatches(node.textContent, exchangeRates);
            if (result.replaced) {
                node.textContent = result.text;
            }
        }
    }
      
    
    
    
    processMatches(text, exchangeRates) {
        

        let replaced = false;
        
        if(!text) {
            return {text, replaced};
        }
        
        let currencyToUse = Currency.getCurrencyBySymbol(text);
        let regexToMatch = Currency.getCurrencyRegex(currencyToUse);
    
        if(!currencyToUse || !regexToMatch){
            return {text, replaced};
        }
    
        while (true) {
            var matches = text.match(regexToMatch, "g");
            if (!matches) break; // exit the loop if no more matches
        
            console.log(regexToMatch);
            console.log(text);
            // find the longest match
            var longestMatch = matches.reduce(function(a, b) { return a.length > b.length ? a : b; });
            
    
            if(longestMatch.length === 1){
                break;
            }
    
            // process the longest match
            var dogecoinAmount =  this.convertToDogecoin(currencyToUse, longestMatch, regexToMatch, exchangeRates);
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
    
    
    
    convertToDogecoin(currencyToUse, currencyStr, regexToMatch, exchangeRates) {
        
        //if we don't clone the regex we can have issues
        const match = new RegExp(regexToMatch.source, regexToMatch.flags).exec(currencyStr);
        
        if (!match) {
            return null; // not a valid currency string
        }
    
        let matchIndex = 0;
    
        if([Currency.CNY, Currency.JPY].indexOf(currencyToUse) > -1) {
            matchIndex = 1;
        }
    
        // Remove the currency symbol, spaces, and commas, then parse as a float
        const valueInCurrency = parseFloat(match[matchIndex].replace(/[^\d.]/g, ''));
    
    
        // Convert to Dogecoin
        return valueInCurrency / exchangeRates[currencyToUse];
    }

}

export { GenericPriceReplacer };