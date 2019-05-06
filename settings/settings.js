function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    manProxyAddress: document.querySelector("#proxyAddress").value,
    manProxyPort: document.querySelector("#proxyPort").value,
    proxyType: document.querySelector('#swSystem').checked == true ? "system" : "manual"
  });
}

function restoreOptions() {

  function setCurrent(result) {
    document.querySelector("#proxyAddress").value = result.manProxyAddress || "localhost";
    document.querySelector("#proxyPort").value = result.manProxyPort || "8080";
    document.querySelector('#swManual').checked = result.proxyType == "manual";
    document.querySelector('#swSystem').checked = result.proxyType == "system";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrent, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
