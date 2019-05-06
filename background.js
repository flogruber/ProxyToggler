/*
 * DefaultSettings
 */
var defaultSettings = {
  proxyType: "system",
  manProxyAddress: "localhost",
  manProxyPort: "8080",
  proxyOn: "true"
};


/*
 * Checks for stored settings
 * and sets the proxy after the first run
 */
function checkStoredSettings(storedSettings) {
  if (!storedSettings.proxyType) {
    browser.storage.local.set(defaultSettings);
    storedSettings = defaultSettings;
  }
  setProxy(storedSettings.proxyType, storedSettings);
}


/*
 * Updates the stored settings
 */
function updateSettings(settings) {
  browser.storage.local.set(settings);
}


/*
 * Retrievs the stored settings
 */
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);


/*
 * General error function
 */
function onError(e) {
  console.error(e);
}


/*
 * Sets the proxy configuration
 */
function setProxy(valType, valStored){
  let proxyTypes = {
    proxyType : valType,
    http: `${valStored.manProxyAddress}:${valStored.manProxyPort}`,
    ssl: `${valStored.manProxyAddress}:${valStored.manProxyPort}`,
    socksVersion: 5
  };
  browser.proxy.settings.set({value: proxyTypes});
  setIcon((valType != "none"));
}


/*
 * Sets the webextension icon
 */
function setIcon(val){
  let icon = val == true ? "link" : "defekter-link";
  browser.browserAction.setIcon({path: `icons/icons8-${icon}-26.png`});
}


/*
 * Sends notifications
 */
function sendNotify(val) {
  browser.notifications.create({
    "type": "basic",
    "title": "ProxyToggler",
    "message": `Proxy set to ${val}`
  });
}


/*
 * Switches the proxy between none and system usage
 */
function switchProxy(storedSettings) {
  let proxyType = "";
  if (storedSettings.proxyOn == "true"){
    storedSettings.proxyOn = "false";
    proxyType = "none";
  } else {
    storedSettings.proxyOn = "true";
    proxyType = storedSettings.proxyType;
  }

  updateSettings(storedSettings);
  setProxy(proxyType, storedSettings);
  sendNotify(proxyType);
}


browser.browserAction.onClicked.addListener(() => {
  const gettingStoredSettings = browser.storage.local.get();
  gettingStoredSettings.then(switchProxy, onError);
});
