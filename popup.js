let toggleButton = document.getElementById("toggle-button");
toggleButton.onclick = function(element) {
  chrome.storage.sync.get(["enabled"], function(result) {
    let newState = !result.enabled;
    chrome.storage.sync.set({ enabled: newState }, function() {
      updateButtonState(newState);
    });
  });
};

function updateButtonState(newState) {
  if (newState == true) {
    toggleButton.innerText = "Turn off";
  } else {
    toggleButton.innerText = "Turn on";
  }
}

chrome.storage.sync.get(["enabled"], function(result) {
  updateButtonState(result.enabled);
});
