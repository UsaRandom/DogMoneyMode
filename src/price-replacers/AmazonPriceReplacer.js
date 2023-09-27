import { Currency } from '../Utilities'

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

export { AmazonPriceReplacer };