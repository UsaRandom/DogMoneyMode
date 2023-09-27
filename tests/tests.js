/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/Utilities.js
class Currency {

    static USD = "usd";
    static EUR = "eur";
    static CNY = "cny";
    static JPY = "jpy";
    static GBP = "gbp";
    static INR = "inr";
    static RUB = "rub";

    static getCurrencyBySymbol(text) {
        if (text.includes("$")) {
          return "usd";
        }
        if (text.includes("€")) {
          return "eur";
        }
        if (text.includes("元")) {
          return "cny";
        }
        if (text.includes("円")) {
          return "jpy";
        }
        if (text.includes("£")) {
          return "gbp";
        }
        if (text.includes("₹")) {
          return "inr";
        }
        if (text.includes("₽")) {
          return "rub";
        }
        return false;
      }

    static getCurrencyRegex(currency) {

        let symbol = null;
        let regexPattern = null;

        switch(currency) {
            case "usd":
                symbol = "$";
                break;
            case "eur": 
                symbol = "€";
                break;
            case "gbp": 
                symbol = "£";
                break;
            case "inr": 
                symbol = "₹";
                break;
            case "rub": 
                symbol = "₽";
                break;
            case "cny": 
                symbol = "元".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d*)?)(${symbol}\\s*)`;
                return new RegExp(regexPattern);
            case "jpy": 
                symbol = "円".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d*)?)(${symbol}\\s*)`;
                return new RegExp(regexPattern);
            default:
                return null;
        }
        regexPattern = `(?<!\\S)(\\${symbol}\\s*\\d*(?:,\\d{3})*(?:\\.\\d*)?(?!\\S))`;
        return new RegExp(regexPattern);
    }
      
}


;// CONCATENATED MODULE: ./src/price-replacers/AmazonPriceReplacer.js


class AmazonPriceReplacer {

    constructor() {

    }

    replace(windowObj, node, exchangeRates) {
        
        if (/^(www\.)?amazon\.[a-z\.]{2,5}$/.test(windowObj.location.hostname)) {

            let priceElements = node.querySelectorAll('.a-price');
            let detectedCurrency = false;

            priceElements.forEach(function(priceElement) {
                
                if(!priceElement.textContent.includes('Ð')){
                    let currencySymbolElement = priceElement.querySelector('.a-price-symbol');
                    let currencySymbol = currencySymbolElement ? currencySymbolElement.textContent : null;
                    let offscreenElement = priceElement.querySelector('.a-offscreen');
                    let offscreenText = offscreenElement ? offscreenElement.textContent : null;
                    
                    if(currencySymbol && !detectedCurrency){
                        let currencyResult = Currency.getCurrencyBySymbol(currencySymbol ? currencySymbol : offscreenText);
                        if(currencyResult) {
                            detectedCurrency = currencyResult;
                        }
                    }
                    
                    let visiblePriceElements = priceElement.querySelectorAll('.a-price-whole, .a-price-fraction');
 
                 if (offscreenElement && visiblePriceElements.length > 0) {
                     // Remove currency symbol and commas before conversion to float
                     let fiat = offscreenElement.textContent.replace(currencySymbol, '').replace(/,/g, '');
                     let dogefy = (parseFloat(fiat) / parseFloat(exchangeRates[detectedCurrency])).toLocaleString('en', {
                                                                     minimumFractionDigits: 2,
                                                                     maximumFractionDigits: 2
                                                                 });
 
                     offscreenElement.textContent = 'Ð' + dogefy;
 
                     if (currencySymbolElement) {
                         currencySymbolElement.textContent = 'Ð';
                     }
 
                     let [whole, fraction] = dogefy.split('.');
                     visiblePriceElements[0].textContent = whole + visiblePriceElements[0].querySelector('.a-price-decimal').textContent;
                     visiblePriceElements[1].textContent = fraction;
                 }
             }



         });
 
     }
    }

}


;// CONCATENATED MODULE: ./src/price-replacers/NewEggPriceReplacer.js

class NewEggPriceReplacer {



    replace(windowObj, node, exchangeRates) {

        let dogecoinValue = exchangeRates.usd;
        
        if (/^(www\.)?newegg\.[a-z\.]{2,5}$/.test(windowObj.location.hostname)) {


            let priceElements = node.querySelectorAll('.price-current');
            let goodsPriceElements = node.querySelectorAll('.goods-price-current');

            priceElements.forEach(function(priceElement) {
                if(!priceElement.textContent.includes('Ð')){
                    let strongElement = priceElement.querySelector('strong');
                    let supElement = priceElement.querySelector('sup');
                    let dollarSymbolIndex = Array.from(priceElement.childNodes).findIndex(node => node.nodeType === 3 && node.nodeValue.includes('$'));

                    if (strongElement && supElement && dollarSymbolIndex > -1) {
                        let fiat = strongElement.textContent.replace(/,/g, '') + '.' + supElement.textContent.replace(/,/g, '');
                        let dogefy = (parseFloat(fiat) / parseFloat(dogecoinValue)).toLocaleString('en', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });

                        let [whole, fraction] = dogefy.split('.');
                        strongElement.textContent = whole;
                        supElement.textContent = fraction;
                        
                        let textNode = priceElement.childNodes[dollarSymbolIndex];
                        textNode.nodeValue = textNode.nodeValue.replace(fiat_currency_symbol, 'Ð');
                    }
                }
            });


            goodsPriceElements.forEach(function(priceElement) {
                if(!priceElement.textContent.includes('Ð')){
                    let strongElement = priceElement.querySelector('.goods-price-value strong');
                    let supElement = priceElement.querySelector('.goods-price-value sup');
                    let currencySymbolElement = priceElement.querySelector('.goods-price-symbol');

                    if (strongElement && supElement) {
                        let fiat = strongElement.textContent.replace(/,/g, '') + '.' + supElement.textContent.replace(/,/g, '');
                        let dogefy = (parseFloat(fiat) / parseFloat(dogecoinValue)).toLocaleString('en', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });

                        let [whole, fraction] = dogefy.split('.');
                        strongElement.textContent = whole;
                        supElement.textContent = fraction;

                        if (currencySymbolElement) {
                            currencySymbolElement.textContent = 'Ð';
                        }
                    }            
                }
            });
        }


    }

}


;// CONCATENATED MODULE: ./src/price-replacers/GenericPriceReplacer.js


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


;// CONCATENATED MODULE: ./src/tests.js





let exchangeRates = {
    usd:0.060374,
    eur:0.057129,
    cny:0.441425,
    jpy:9.0,
    gbp:0.04966732,
    inr:5.03,
    rub:5.82
};

let priceReplacers = [];

priceReplacers.push(new AmazonPriceReplacer());
priceReplacers.push(new NewEggPriceReplacer());
priceReplacers.push(new GenericPriceReplacer());




async function runAllTests() {
    
    let tests = document.getElementsByClassName("test");
    let mockWindow = {
        location: {
            hostname: "https://www.amazon.com/"
        }
    };

    for (let test of tests) {
        let expected = test.getElementsByClassName("expected")[0].textContent.trim();
        let resultElement = test.getElementsByClassName("result")[0]; 
    
        priceReplacers.forEach(priceReplacer => {
            priceReplacer.replace(mockWindow, resultElement, exchangeRates);
        });
        
        let result = resultElement.textContent.trim();
        
        console.log(`${expected}|${result}`);
        
        if (expected === result) {
            resultElement.classList.add("pass");
        } else {
            resultElement.classList.add("fail");
        }

        // Add a 2.5-second lag between each test
        await new Promise(resolve => setTimeout(resolve, 50));
    }

}


document.getElementById("run-button").onclick = async function() {
    await runAllTests();
};
/******/ })()
;