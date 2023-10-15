import { ExchangeRateStore } from './ExchangeRateStore';
import { AppStateStore } from './AppStateStore';

const appStateStore = new AppStateStore();
const exchangeRateStore = new ExchangeRateStore();
const refreshTimeMs = 45000;

(async () => {
  let state = await appStateStore.getAppState();
  let exchangeRates = await exchangeRateStore.getRates(false);

  setInterval(async () => {
    try {
      state = await appStateStore.getAppState();
      
      if (state.dogMoneyModeEnabled) {
        const rates = await exchangeRateStore.getRates(false);
        console.log('Rates fetched:', rates);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  }, refreshTimeMs);  
})();
