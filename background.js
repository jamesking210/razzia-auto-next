// Razzia Auto Next
// Click the pinned Chrome extension icon to toggle Auto Next ON/OFF globally.
// OFF also sends an immediate message to the active tab so pending clicks are cancelled right away.

const STORAGE_KEY = "enabled";
const DEFAULT_ENABLED = true;
const MESSAGE_TYPE_SET_ENABLED = "RAZZIA_AUTO_NEXT_SET_ENABLED";

function getEnabled(callback) {
  chrome.storage.local.get({ [STORAGE_KEY]: DEFAULT_ENABLED }, (result) => {
    callback(Boolean(result[STORAGE_KEY]));
  });
}

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? "#1f8f3a" : "#777777" });
  chrome.action.setTitle({
    title: enabled
      ? "Razzia Auto Next: ON — click to turn OFF"
      : "Razzia Auto Next: OFF — click to turn ON"
  });
}

function notifyCurrentTab(tab, enabled) {
  if (!tab || !tab.id) return;

  // Best-effort. This fails harmlessly if the current tab is not a Razzia manager page.
  chrome.tabs.sendMessage(
    tab.id,
    { type: MESSAGE_TYPE_SET_ENABLED, enabled: Boolean(enabled) },
    () => void chrome.runtime.lastError
  );
}

function setEnabled(enabled, tab, callback) {
  const nextEnabled = Boolean(enabled);

  chrome.storage.local.set({ [STORAGE_KEY]: nextEnabled }, () => {
    updateBadge(nextEnabled);
    notifyCurrentTab(tab, nextEnabled);
    if (callback) callback();
  });
}

function initializeState() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (typeof result[STORAGE_KEY] === "undefined") {
      chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_ENABLED }, () => {
        updateBadge(DEFAULT_ENABLED);
      });
    } else {
      updateBadge(Boolean(result[STORAGE_KEY]));
    }
  });
}

chrome.runtime.onInstalled.addListener(initializeState);
chrome.runtime.onStartup.addListener(initializeState);

chrome.action.onClicked.addListener((tab) => {
  getEnabled((enabled) => {
    setEnabled(!enabled, tab);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes[STORAGE_KEY]) {
    updateBadge(Boolean(changes[STORAGE_KEY].newValue));
  }
});

initializeState();
