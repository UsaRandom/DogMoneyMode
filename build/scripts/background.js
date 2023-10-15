/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/ExchangeRateStore.js
class ExchangeRateStore {
  constructor() {
    this.localStorageKey = 'dmm-exchange-rates';
    this.timeToLive = 120000; // 2 minutes in milliseconds
  }

  async _fetchRates() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=USD,EUR,CNY,JPY,GBP,INR,RUB');
    const data = await response.json();
    const rates = data.dogecoin;
    const updatedOn = Date.now();

    const storageObject = {
      updatedOn,
      rates,
    };

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [this.localStorageKey]: storageObject }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(storageObject);
      });
    });
  }

  async getRates(isContentScript = true) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(this.localStorageKey, async (result) => {
        let storedData = result[this.localStorageKey];
        if (!isContentScript && (!storedData || Date.now() - storedData.updatedOn > this.timeToLive)) {
          try {
            storedData = await this._fetchRates();
          } catch (error) {
            return reject(error);
          }
        }
        resolve(storedData.rates);
      });
    });
  }
}



;// CONCATENATED MODULE: ./src/AppStateStore.js
class AppStateStore {
  constructor() {
    this.localStorageKey = 'dmm-app-state';
  }

  async setAppState(stateObj) {
    const obj = {};
    obj[this.localStorageKey] = stateObj;
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(obj, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  async getAppState() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(this.localStorageKey, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[this.localStorageKey] || {"dogMoneyModeEnabled": false, "comicSansModeEnabled": false});
      });
    });
  }
}



;// CONCATENATED MODULE: ./src/background.js



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

/******/ })()
;