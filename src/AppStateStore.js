class AppStateStore {
  constructor() {
    this.localStorageKey = 'dmm-app-state';
  }

  setAppState(stateObj) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(stateObj));
  }

  getAppState() {
    const storedData = JSON.parse(localStorage.getItem(this.localStorageKey));
    return storedData || {"dogMoneyModeEnabled": false, "comicSansModeEnabled": false};
  }
}

export { AppStateStore };