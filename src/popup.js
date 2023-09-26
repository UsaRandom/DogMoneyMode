import { AppStateStore } from './AppStateStore';

let appStateStore = new AppStateStore();



(async function update() {
  try {
    let appState = await appStateStore.getAppState();
        
    let dogMoneyModeToggleButton = document.getElementById("dogmoneymode-toggle");
    let comicSansModeToggleButton = document.getElementById("comicsans-toggle");

    dogMoneyModeToggleButton.checked = appState.dogMoneyModeEnabled;
    comicSansModeToggleButton.checked = appState.comicSansModeEnabled;

    dogMoneyModeToggleButton.addEventListener("change", function(e) {
      appState.dogMoneyModeEnabled = e.target.checked;
      appStateStore.setAppState(appState);
    });

    comicSansModeToggleButton.addEventListener("change", function(e) {
      appState.comicSansModeEnabled = e.target.checked;
      appStateStore.setAppState(appState);
    });

    
    var tipsButton = document.getElementById('tips');
    var tipContent = document.getElementById('tip-content');

    tipsButton.addEventListener('click', function(event) {
      event.preventDefault();
      if (window.getComputedStyle(tipContent).display === 'none') {
        tipContent.style.display = 'block';
      } else {
        tipContent.style.display = 'none';
      }
    });

  } catch (error) {
      console.error(error);
  }
})();
