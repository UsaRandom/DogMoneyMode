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

export { ExchangeRateStore };
