import { AppStateStore } from './AppStateStore';

let appStateStore = new AppStateStore();
let audio = new Audio("wow.mp3");

(async function update() {
  try {
    let appState = await appStateStore.getAppState();
        
    let dogMoneyModeToggleButton = document.getElementById("dogmoneymode-toggle");
    let comicSansModeButton = document.getElementById("comicsans-toggle");
    let wowMuteButton = document.getElementById("mute-toggle");

    dogMoneyModeToggleButton.checked = appState.dogMoneyModeEnabled;
    dogMoneyModeToggleButton.addEventListener("change", function(e) {
      appState.dogMoneyModeEnabled = e.target.checked;


      if(appState.dogMoneyModeEnabled && !appState.wowButtonMuted) {
        audio.currentTime = 0.2;
        audio.play();
      } else {
        audio.pause();
      }

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



    if(appState.wowButtonMuted) {
      wowMuteButton.textContent = "much wow";
      wowMuteButton.classList.add("mute-on");
    }
    else {
      wowMuteButton.textContent = "very quiet";
      wowMuteButton.classList.remove("mute-on");
    }

    
    wowMuteButton.addEventListener("click", function(e) {

      appState.wowButtonMuted = !appState.wowButtonMuted;
          
      if(appState.wowButtonMuted) {
        wowMuteButton.textContent = "much wow";
        wowMuteButton.classList.add("mute-on");
        audio.pause();
      }
      else {
        wowMuteButton.textContent = "very quiet";
        wowMuteButton.classList.remove("mute-on");
      }
      
      appStateStore.setAppState(appState);
    });


  } catch (error) {
      console.error(error);
  }
})();
