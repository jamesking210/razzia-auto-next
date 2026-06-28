# Razzia Auto Next

A tiny Chrome / Edge extension for people hosting a self-hosted [Razzia](https://github.com/Ralex91/Razzia) quiz game.

It watches the **Razzia manager screen** and clicks only the visible **Next**, **Next Question**, or **Next Round** button after a 5-second delay.

It does **not** click Start, Skip, Continue, Results, Scoreboard, Finish, or Exit.

## Why this exists

Razzia is great for self-hosted quiz nights, but the host normally has to keep pressing **Next** from the manager screen. This extension helps the game flow hands-free while still letting the host pause it instantly.

## Features

- Works on normal Razzia manager URLs:
  - `http://localhost:3000/manager`
  - `http://192.168.1.19:3000/manager`
  - `http://laptop1.local:3000/manager`
  - `https://your-domain.com/manager`
  - `*/party/manager/*`
- 5-second delay before clicking Next
- Toolbar/pinned-icon ON/OFF toggle
- OFF cancels any pending click immediately
- No on-screen overlay or control box
- Stores ON/OFF state locally in Chrome
- Uses only the `storage` permission

## Install as an unpacked extension

1. Download and unzip this folder somewhere permanent.
2. Open Chrome or Edge.
3. Go to `chrome://extensions` or `edge://extensions`.
4. Turn on **Developer mode**.
5. Remove or disable any older copy of Razzia Auto Next.
6. Click **Load unpacked**.
7. Select the unzipped `razzia-auto-next` folder.
8. Pin the extension from the browser puzzle-piece menu.

## Use

Click the pinned extension icon:

- **ON** = Auto Next is active.
- **OFF** = Auto Next is paused and pending clicks are cancelled.

The extension is invisible on the Razzia page itself. The only visible indicator is the ON/OFF badge on the browser toolbar icon.

## Troubleshooting

After updating from an old version, fully refresh the Razzia manager tab with **Ctrl+F5** or close and reopen the tab. Browser content scripts can stay alive on an already-open tab until the page reloads.

If it does not work, confirm the host is on a Razzia manager route such as:

- `/manager`
- `/manager/`
- `/party/manager/...`

Also make sure the extension badge says **ON**.

## Notes

This is an unofficial helper extension for Razzia hosts. It is not part of the official Razzia project.
