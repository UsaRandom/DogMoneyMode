
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

export { NewEggPriceReplacer };