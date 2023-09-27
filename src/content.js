import { AmazonPriceReplacer } from './price-replacers/AmazonPriceReplacer';
import { NewEggPriceReplacer } from './price-replacers/NewEggPriceReplacer';
import { GenericPriceReplacer } from './price-replacers/GenericPriceReplacer';

let priceReplacers = [];

priceReplacers.push(new AmazonPriceReplacer());
priceReplacers.push(new NewEggPriceReplacer());
priceReplacers.push(new GenericPriceReplacer());


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

        updateInterval = setInterval(update, updateSpeed);
    } catch (error) {
        console.error(error);
    }
})();



function convertPrices() {

    priceReplacers.forEach(priceReplacer => {
        priceReplacer.replace(window, document.body, exchangeRates);
    });

}

