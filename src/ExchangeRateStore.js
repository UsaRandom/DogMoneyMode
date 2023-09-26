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

    localStorage.setItem(this.localStorageKey, JSON.stringify(storageObject));
    return storageObject;
  }

  async getRates() {
    let storedData = JSON.parse(localStorage.getItem(this.localStorageKey));
    if (!storedData || Date.now() - storedData.updatedOn > this.timeToLive) {
      storedData = this._fetchRates();
    }
    return storedData.rates;
  }
}
export { ExchangeRateStore };
