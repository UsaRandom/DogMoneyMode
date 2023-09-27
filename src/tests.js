
import { AmazonPriceReplacer } from './price-replacers/AmazonPriceReplacer';
import { NewEggPriceReplacer } from './price-replacers/NewEggPriceReplacer';
import { GenericPriceReplacer } from './price-replacers/GenericPriceReplacer';

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

        // dramatic pause!
        await new Promise(resolve => setTimeout(resolve, 50));
    }

}


document.getElementById("run-button").onclick = async function() {
    await runAllTests();
};