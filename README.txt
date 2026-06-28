Razzia Auto Next
================

A small Chrome extension for Razzia quiz hosts.

What it does
------------
Razzia Auto Next clicks the visible Razzia manager Next button after a 5-second delay.

Use the pinned Chrome extension icon to toggle:

ON  = Auto Next is active
OFF = Auto Next is paused and pending clicks are cancelled

Supported routes
----------------
/manager
/party/manager/...

Tested host styles
------------------
localhost
LAN IP address
local hostname
HTTP domain
HTTPS domain

Install
-------
1. Download this repo as a ZIP from GitHub.
2. Extract the ZIP somewhere permanent.
3. Open Chrome and go to chrome://extensions
4. Turn on Developer mode.
5. Click Load unpacked.
6. Select the extracted folder that contains manifest.json.
7. Pin Razzia Auto Next from the Chrome puzzle-piece menu.

Important
---------
Chrome loads unpacked extensions directly from the folder you select.
If you move, rename, or delete that folder, Chrome may stop loading the extension.

Troubleshooting
---------------
If you update the extension, remove or disable the old version, load the new folder, then refresh the Razzia manager tab with Ctrl+F5.

Do not leave multiple versions enabled at the same time.

Privacy
-------
No server, no tracking, no analytics.
Only the ON/OFF state is stored locally in Chrome.
