(() => {
  "use strict";

  // Razzia Auto Next
  // Invisible extension: no page controls, no overlay, no page changes.
  // Click the pinned Chrome extension icon to toggle Auto Next ON/OFF.
  // OFF clears pending clicks immediately and the extension checks storage again right before clicking.

  if (window.__razziaAutoNextLoaded) return;
  window.__razziaAutoNextLoaded = true;

  const TAG = "[Razzia Auto Next]";
  const STORAGE_KEY = "enabled";
  const DEFAULT_ENABLED = true;
  const CLICK_DELAY_MS = 5000;
  const SCAN_MS = 500;
  const CLICK_COOLDOWN_MS = 3500;
  const MESSAGE_TYPE_SET_ENABLED = "RAZZIA_AUTO_NEXT_SET_ENABLED";

  // Keep this small on purpose. We are not clicking Start, Skip,
  // Continue, Results, Scoreboard, Finish, etc. Just the real Next button.
  const NEXT_TEXT_PATTERNS = [
    /^next$/i,
    /^next question$/i,
    /^next round$/i
  ];

  let stateLoaded = false;
  let autoNextEnabled = DEFAULT_ENABLED;
  let pending = null;
  let clickCheckInProgress = false;
  let lastClickedAt = 0;
  let lastLocation = location.href;

  function log(message, extra) {
    if (extra !== undefined) {
      console.log(`${TAG} ${message}`, extra);
    } else {
      console.log(`${TAG} ${message}`);
    }
  }

  function setLocalEnabled(enabled, reason) {
    autoNextEnabled = Boolean(enabled);

    if (!autoNextEnabled) {
      clearPending(reason || "Auto Next turned off");
      clickCheckInProgress = false;
    }

    log(`Auto Next is ${autoNextEnabled ? "ON" : "OFF"}${reason ? ` (${reason})` : ""}`);

    if (autoNextEnabled) {
      scheduleScan(reason || "enabled");
    }
  }

  function loadEnabledState(callback) {
    if (!chrome?.storage?.local) {
      stateLoaded = true;
      setLocalEnabled(DEFAULT_ENABLED, "storage unavailable; using default");
      if (callback) callback();
      return;
    }

    chrome.storage.local.get({ [STORAGE_KEY]: DEFAULT_ENABLED }, (result) => {
      stateLoaded = true;
      setLocalEnabled(Boolean(result[STORAGE_KEY]), "loaded");
      if (callback) callback();
    });
  }

  function watchEnabledState() {
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== "local" || !changes[STORAGE_KEY]) return;
        setLocalEnabled(Boolean(changes[STORAGE_KEY].newValue), "storage changed");
      });
    }

    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener((message) => {
        if (!message || message.type !== MESSAGE_TYPE_SET_ENABLED) return;
        setLocalEnabled(Boolean(message.enabled), "toolbar clicked");
      });
    }
  }

  function isRazziaManagerRoute() {
    const path = location.pathname.toLowerCase();

    return (
      path === "/manager" ||
      path.startsWith("/manager/") ||
      path.startsWith("/party/manager/")
    );
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function textOf(el) {
    return normalizeText(
      el.innerText ||
        el.textContent ||
        el.getAttribute("aria-label") ||
        el.getAttribute("title") ||
        el.getAttribute("value") ||
        ""
    );
  }

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;

    const style = window.getComputedStyle(el);
    const box = el.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      style.pointerEvents !== "none" &&
      box.width > 5 &&
      box.height > 5
    );
  }

  function isEnabled(el) {
    return (
      el &&
      !el.disabled &&
      el.getAttribute("aria-disabled") !== "true" &&
      !el.classList.contains("pointer-events-none")
    );
  }

  function isNextText(text) {
    const cleaned = normalizeText(text);
    if (!cleaned) return false;

    return NEXT_TEXT_PATTERNS.some((pattern) => pattern.test(cleaned));
  }

  function candidateSignature(el) {
    const box = el.getBoundingClientRect();
    return [
      textOf(el).toLowerCase(),
      Math.round(box.x),
      Math.round(box.y),
      Math.round(box.width),
      Math.round(box.height)
    ].join("|");
  }

  function findNextButton() {
    const selectors = [
      "button",
      "[role='button']",
      "input[type='button']",
      "input[type='submit']",
      "a"
    ];

    const candidates = Array.from(document.querySelectorAll(selectors.join(",")));

    return candidates.find((el) => {
      const text = textOf(el);
      return isVisible(el) && isEnabled(el) && isNextText(text);
    }) || null;
  }

  function clearPending(reason) {
    if (pending) {
      log(`cleared pending button: ${reason}`);
    }

    pending = null;
  }

  function clickElement(el) {
    el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    el.click();
  }

  function getFreshEnabled(callback) {
    // Prevents the bug where the user turns OFF during the 5-second delay,
    // but an older scan still clicks afterward.
    if (!chrome?.storage?.local) {
      callback(Boolean(autoNextEnabled));
      return;
    }

    chrome.storage.local.get({ [STORAGE_KEY]: DEFAULT_ENABLED }, (result) => {
      const freshEnabled = Boolean(result[STORAGE_KEY]);
      autoNextEnabled = freshEnabled;
      callback(freshEnabled);
    });
  }

  function maybeClickAfterFreshCheck(signature, text) {
    if (clickCheckInProgress) return;
    clickCheckInProgress = true;

    getFreshEnabled((freshEnabled) => {
      clickCheckInProgress = false;

      if (!freshEnabled || !autoNextEnabled) {
        clearPending("Auto Next is off before click");
        return;
      }

      if (!isRazziaManagerRoute()) {
        clearPending("not on Razzia manager route before click");
        return;
      }

      const stillBtn = findNextButton();

      if (!stillBtn || candidateSignature(stillBtn) !== signature) {
        clearPending("button changed before delay finished");
        return;
      }

      const now = Date.now();

      if (now - lastClickedAt < CLICK_COOLDOWN_MS) {
        return;
      }

      log(`clicking "${text}" after ${CLICK_DELAY_MS / 1000}s`);
      lastClickedAt = now;
      pending = null;
      clickElement(stillBtn);
    });
  }

  function scan(reason = "scan") {
    if (!stateLoaded) return;

    if (!autoNextEnabled) {
      clearPending("Auto Next is off");
      return;
    }

    if (!isRazziaManagerRoute()) {
      clearPending("not on Razzia manager route");
      return;
    }

    const btn = findNextButton();

    if (!btn) {
      clearPending("no visible Next button");
      return;
    }

    const now = Date.now();
    const signature = candidateSignature(btn);

    if (!pending || pending.signature !== signature) {
      pending = {
        signature,
        firstSeenAt: now,
        text: textOf(btn)
      };

      log(`saw "${pending.text}" button; waiting ${CLICK_DELAY_MS / 1000}s`);
      return;
    }

    if (now - lastClickedAt < CLICK_COOLDOWN_MS) {
      return;
    }

    if (now - pending.firstSeenAt < CLICK_DELAY_MS) {
      return;
    }

    maybeClickAfterFreshCheck(pending.signature, pending.text);
  }

  function scheduleScan(reason) {
    window.setTimeout(() => scan(reason), 50);
    window.setTimeout(() => scan(reason), 500);
  }

  function watchRouteChanges() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function patchedPushState(...args) {
      const result = originalPushState.apply(this, args);
      scheduleScan("pushState");
      return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
      const result = originalReplaceState.apply(this, args);
      scheduleScan("replaceState");
      return result;
    };

    window.addEventListener("popstate", () => scheduleScan("popstate"));
    window.addEventListener("hashchange", () => scheduleScan("hashchange"));
  }

  function watchDomChanges() {
    const observer = new MutationObserver(() => scheduleScan("dom mutation"));

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class",
        "style",
        "disabled",
        "aria-disabled",
        "aria-label",
        "title",
        "value"
      ]
    });
  }

  function watchLocationFallback() {
    window.setInterval(() => {
      if (location.href !== lastLocation) {
        lastLocation = location.href;
        clearPending("route changed");
        scheduleScan("location fallback");
      }

      scan("interval");
    }, SCAN_MS);
  }

  watchEnabledState();
  watchRouteChanges();
  watchDomChanges();
  watchLocationFallback();

  loadEnabledState(() => {
    scheduleScan("initial load");
  });
})();
