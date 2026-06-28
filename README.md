# Razzia Auto Next

A small Chrome extension for **Razzia** quiz hosts.

Razzia Auto Next automatically clicks the visible Razzia manager **Next** button after a 5-second delay. It includes a pinned Chrome toolbar **ON/OFF** toggle so the host can pause or resume auto-advance at any time.

> Public beta: this is not a Chrome Web Store extension yet. Install it only if you are comfortable loading an unpacked Chrome extension.

---

## What it does

When you are hosting a Razzia game from the manager screen, this extension watches for the visible **Next** button.

When Auto Next is **ON**:

- waits 5 seconds
- clicks the visible Razzia **Next** button
- continues watching for the next manager step

When Auto Next is **OFF**:

- does not click Next
- cancels any pending delayed click immediately

The extension does not add anything on top of the Razzia page. There is no on-screen control box. Control is handled from the pinned Chrome extension icon.

---

## Features

- 5-second delay before clicking **Next**
- Chrome toolbar ON/OFF toggle
- OFF cancels pending clicks
- No visible overlay or control box
- Works with normal Razzia manager routes:
  - `/manager`
  - `/party/manager/...`
- Works with common hosting setups:
  - localhost
  - LAN IP address
  - local hostname
  - HTTP domain
  - HTTPS domain
- Stores only the ON/OFF setting locally in Chrome
- No server, no analytics, no tracking

---

## Tested URL examples

The extension is designed to work with Razzia manager pages such as:

```text
http://localhost:3000/manager
http://192.168.1.19:3000/manager
http://laptop1.local:3000/manager
https://your-domain.com/manager
http://192.168.1.19:3000/party/manager/ABC123
```

---

## What it clicks

The extension only looks for visible, enabled Razzia manager buttons with text like:

```text
Next
Next Question
Next Round
```

It is intentionally focused on the normal host “next step” flow.

---

## Install

This extension is currently installed as an unpacked Chrome extension.

### 1. Download and extract

For public testing, use one of these options:

- Click **Code** → **Download ZIP** on this GitHub repo, or
- Download the ZIP from the GitHub **Releases** page if a release has been posted.

Right-click the ZIP and choose **Extract All**.

Move the extracted folder somewhere you will keep it.

Good examples:

```text
Documents\Razzia Auto Next
Desktop\Razzia Auto Next
C:\Tools\Razzia Auto Next
```

Avoid putting it somewhere you might delete later, such as a temporary downloads folder.

Chrome loads the extension directly from this folder. If you move, rename, or delete the folder after installing it, Chrome may not be able to run the extension.

### 2. Open Chrome extensions

Open Chrome and go to:

```text
chrome://extensions
```

### 3. Turn on Developer mode

Turn on **Developer mode** in the top-right corner.

### 4. Load the extension

Click **Load unpacked**.

Select the extracted folder that contains:

```text
manifest.json
background.js
content.js
images/
```

### 5. Pin the extension

Click the Chrome puzzle-piece icon and pin **Razzia Auto Next**.

---

## Use

1. Open your Razzia manager page.
2. Pin the extension icon if it is not already pinned.
3. Click the extension icon to toggle Auto Next.

Badge meanings:

```text
ON  = Auto Next is active
OFF = Auto Next is paused
```

When **ON**, the extension waits 5 seconds and then clicks the visible Razzia **Next** button.

When **OFF**, the extension will not click Next. Any pending delayed click is cancelled.

---

## Updating

When installing a newer version:

1. Go to `chrome://extensions`.
2. Remove or disable the old version.
3. Extract the new ZIP somewhere permanent.
4. Click **Load unpacked**.
5. Select the new extracted folder.
6. Refresh the Razzia manager tab with `Ctrl + F5`.
7. Pin the new extension icon.

Do not leave multiple versions enabled at the same time, or more than one extension may try to control the game.

---

## Troubleshooting

### The extension does not appear in Chrome

Make sure you extracted the ZIP first. Do not load the ZIP file directly.

In `chrome://extensions`, click **Load unpacked** and select the extracted folder that contains `manifest.json`.

---

### Chrome says the extension is broken or missing files

Make sure the folder contains:

```text
manifest.json
background.js
content.js
images/
  icon16.png
  icon32.png
  icon48.png
  icon128.png
```

If those files are inside another nested folder, select that inner folder when using **Load unpacked**.

---

### The extension disappeared or stopped loading

Chrome runs unpacked extensions from the folder you selected during install.

If you moved, renamed, or deleted that folder, Chrome may not be able to load it anymore.

Fix:

1. Put the extension folder somewhere permanent.
2. Go to `chrome://extensions`.
3. Remove the broken copy.
4. Click **Load unpacked** again.
5. Select the permanent extension folder.

---

### It is not clicking Next

Check these things:

1. Make sure the extension badge says **ON**.
2. Make sure you are on a Razzia manager page.
3. The URL should include one of these:

```text
/manager
/party/manager
```

4. Refresh the Razzia manager tab.
5. Make sure there is not another old version of Razzia Auto Next also installed.
6. Confirm the visible button says **Next**, **Next Question**, or **Next Round**.

---

### It still clicks when I thought it was off

Click the pinned extension icon and make sure the badge says **OFF**.

If you just updated from an older version, fully reload the Razzia manager tab with:

```text
Ctrl + F5
```

or close and reopen the manager tab.

Old Chrome content scripts can stay alive in a tab until the page is refreshed.

---

### I installed a new version and now two icons show up

You probably have two versions installed.

Fix:

1. Go to `chrome://extensions`.
2. Remove or disable the older copy.
3. Keep only the newest version enabled.
4. Refresh the Razzia manager tab.

---

## Beta testing feedback

Please open a GitHub Issue if something does not work.

Helpful details to include:

```text
Razzia URL used:
Example: http://localhost:3000/manager

What happened:
Describe the problem.

Expected behavior:
What should it have done?

Chrome version:
Paste from chrome://settings/help

Extension state:
Was it ON or OFF?

Notes:
Anything else that might help.
```

Useful things to report:

- whether it works on localhost
- whether it works on a LAN IP
- whether it works on a domain
- whether it works on an HTTPS domain
- whether ON/OFF works reliably
- whether OFF cancels pending clicks
- whether it ever clicks when it should not
- whether it ever misses the Next button

---

## Privacy

Razzia Auto Next does not collect, transmit, sell, or share user data.

It stores only its ON/OFF setting locally in Chrome using Chrome extension storage.

There is no server, no account, no analytics, and no tracking.

See [`PRIVACY.md`](PRIVACY.md) for the standalone privacy note.

---

## Notes

This extension is an independent helper for Razzia hosts.

It is not an official Razzia project unless adopted by the Razzia maintainers.
