import { AppStateStore } from './AppStateStore';

let appStateStore = new AppStateStore();
let appState = appStateStore.getAppState();

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

document.addEventListener('DOMContentLoaded', function() {

  let dogMoneyModeToggleButton = document.getElementById("dogmoneymode-toggle");
  let comicSansModeToggleButton = document.getElementById("comicsans-toggle");

  dogMoneyModeToggleButton.checked = appState.dogMoneyModeEnabled;
  dogMoneyModeToggleButton.addEventListener("change", function(e) {
    appState.dogMoneyModeEnabled = e.target.checked;
    appStateStore.setAppState(appState);
  });

  comicSansModeToggleButton.checked = appState.comicSansModeEnabled;
  comicSansModeToggleButton.addEventListener("change", function(e) {
    appState.comicSansModeEnabled = e.target.checked;
    appStateStore.setAppState(appState);
  });

});