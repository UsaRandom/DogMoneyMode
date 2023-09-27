import { AppStateStore } from './AppStateStore';

let appStateStore = new AppStateStore();



(async function update() {
  try {
    let appState = await appStateStore.getAppState();
        
    let dogMoneyModeToggleButton = document.getElementById("dogmoneymode-toggle");

    dogMoneyModeToggleButton.checked = appState.dogMoneyModeEnabled;
    dogMoneyModeToggleButton.addEventListener("change", function(e) {
      appState.dogMoneyModeEnabled = e.target.checked;
      appStateStore.setAppState(appState);
    });

  } catch (error) {
      console.error(error);
  }
})();
