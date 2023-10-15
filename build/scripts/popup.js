/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

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



;// CONCATENATED MODULE: ./src/popup.js


let appStateStore = new AppStateStore();



(async function update() {
  try {
    let appState = await appStateStore.getAppState();
        
    let dogMoneyModeToggleButton = document.getElementById("dogmoneymode-toggle");
    let comicSansModeButton = document.getElementById("comicsans-toggle");

    dogMoneyModeToggleButton.checked = appState.dogMoneyModeEnabled;
    dogMoneyModeToggleButton.addEventListener("change", function(e) {
      appState.dogMoneyModeEnabled = e.target.checked;
      appStateStore.setAppState(appState);
    });

    if(appState.comicSansModeEnabled) {
      comicSansModeButton.textContent = "so default";
      comicSansModeButton.classList.add("comicsans-on");
    } else {
      comicSansModeButton.textContent = "very comic";
      comicSansModeButton.classList.remove("comicsans-on");
    }

    comicSansModeButton.addEventListener("click", function(e) {

      appState.comicSansModeEnabled = !appState.comicSansModeEnabled;
        
      if(appState.comicSansModeEnabled) {
        comicSansModeButton.textContent = "so default";
        comicSansModeButton.classList.add("comicsans-on");
      } else {
        comicSansModeButton.textContent = "very comic";
        comicSansModeButton.classList.remove("comicsans-on");
      }
      
      appStateStore.setAppState(appState);
    });

  } catch (error) {
      console.error(error);
  }
})();

/******/ })()
;