## RULES:
1.) Use minimal tokens, optimize tasks for efficient use of tokens. 
2.) Avoid reading large files, and if you do, compress the summary for context next time you need to read through. NOTE this does not apply to our active files, only to documentation, specs, node_modules or external resources. 
3.) Avoid comments in code unless absolutely necessary. IF you find comments that where already there, leave them in. 
4.) If you find yourself repeating a task for the third time, ask me about making it into a skill. 
5.) Think outside the box. Be creative. I like irregular suggestions and ideas.

## PROJECT CONTEXT:
TabRestore is a Manifest V3 browser extension. Saves open tabs to a `.txt` file, restores them later. Pure vanilla JS/HTML/CSS — no npm, no build system, no dependencies.

**Active files:**
- `manifest.json` — Chrome (includes `tabGroups` permission)
- `manifest_firefox.json` — Firefox (`tabGroups` stripped; FF doesn't support it; code feature-detects before calling)
- `popup/popup.html` — Main popup UI
- `popup/popup.js` — Save/load/settings logic, storage reads
- `popup/load.js` — Tab restore logic (runs in a dedicated load.html tab)
- `popup/popup.css` — Styles + overlay animations

**Settings keys** (chrome.storage.local): `preserveCurrentTabs`, `includePinnedTabs`, `removeDuplicates`, `customFilename`

**Features:** Save tabs → timestamped `.txt`, custom filename overlay, load → replace or preserve current tabs, tab groups on load (Chrome only, named after file), settings panel overlay, Ko-fi button in settings.

**Store status (v1.1):** Submitting to Chrome Web Store + Firefox AMO. Assets in `store_assets/`. Firefox for Android min version 142 (supported but not actively targeted).

## USER CONTEXT:
Sky is a solo indie dev. Prefers dependency-free, minimal solutions.