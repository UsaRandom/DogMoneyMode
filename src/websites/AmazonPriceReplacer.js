import { Currency } from '../Utilities'

class AmazonPriceReplacer {

    constructor() {

    }

    replace(exchangeRates) {
        
        if (/^(www\.)?amazon\.[a-z\.]{2,5}$/.test(window.location.hostname)) {

            let priceElements = document.querySelectorAll('.a-price');
            let detectedCurrency = null;

            priceElements.forEach(function(priceElement) {
                
                if(!priceElement.textContent.includes('Ð')){

                    let currencySymbolElement = priceElement.querySelector('.a-price-symbol');
                    let currencySymbol = currencySymbolElement.textContent;

                    if(!detectedCurrency){
                        let currencyResult = Currency.getCurrencyBySymbol(currencySymbol);
                        if(currencyResult) {
                            detectedCurrency = currencyResult;
                            console.log("Detected ${currencyResult}")
                        }
                    }
    
                 var offscreenElement = priceElement.querySelector('.a-offscreen');
                 var visiblePriceElements = priceElement.querySelectorAll('.a-price-whole, .a-price-fraction');
 
                 if (offscreenElement && visiblePriceElements.length > 0) {
                     // Remove currency symbol and commas before conversion to float
                     var fiat = offscreenElement.textContent.replace(currencySymbol, '').replace(/,/g, '');
                     var dogefy = (parseFloat(fiat) / parseFloat(exchangeRates[detectedCurrency])).toLocaleString('en', {
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
    }

}

export { AmazonPriceReplacer };