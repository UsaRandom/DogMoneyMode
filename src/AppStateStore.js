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
        resolve(result[this.localStorageKey] || {"dogMoneyModeEnabled": false, "comicSansModeEnabled": false, "wowButtonMuted": false});
      });
    });
  }
}

export { AppStateStore };
