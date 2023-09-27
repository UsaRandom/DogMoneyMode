import { AppStateStore } from './AppStateStore';

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
