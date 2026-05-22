# Firefox AMO Submission Checklist

## Assets needed before submitting

### Screenshots (REQUIRED — min 1, max 10)
- `screenshot_1.png` — 1280x800px recommended
- Suggested shots:
  1. Main popup showing Save/Load buttons
  2. Settings panel open
  3. Save overlay with filename input
  4. Tabs being restored

### Icons
- [x] 32x32px — icon32.png
- [x] 64x64px — icon64.png

---

## Store listing copy (fill in at submit time)

**Name:** TabRestore

**Summary (up to 250 chars):**
Save your open tabs to a .txt file and restore them later. Simple session management — no accounts, no cloud sync, just a file you own.

**Description:**
TabRestore is a lightweight session manager. Save all your open tabs to a plain .txt file with one click, and restore them later just as easily.

Features:
- Save your current tabs to a timestamped .txt file
- Load a saved session — replace your current tabs or add to them
- Skip duplicate URLs on save and load
- Exclude pinned tabs from saves
- Custom filename prompt before saving

No accounts. No cloud sync. Just a .txt file you own.

**Category:** Productivity

**Support email / website:** (fill in)

**License:** All Rights Reserved (or choose appropriate)

**Privacy policy:**
TabRestore does not collect, transmit, or store any user data outside the browser. Settings are saved locally using browser.storage.local and never leave the device.

---

## Submission notes for reviewers

TabRestore uses the following permissions:
- `tabs` — to read the URLs of open tabs for saving, and to open/close tabs when loading a session
- `activeTab` — to identify the current tab
- `storage` — to persist user settings (Keep Current Tabs, Include Pinned Tabs, etc.) locally
- `tabGroups` — declared for future use; the code feature-detects this API before calling it

All code is original and human-readable. No minification, no transpilation, no external dependencies.

---

## Items already complete
- [x] Manifest V3
- [x] Icons at 16, 32, 48, 64, 128px
- [x] gecko browser_specific_settings with extension ID
- [x] strict_min_version set to 109.0
- [x] No remote code execution
- [x] No obfuscated code
- [x] No host_permissions
- [x] No content scripts
- [x] All code bundled locally
- [x] tabGroups removed from submission manifest (Firefox doesn't implement this API — kept in manifest_firefox.json source for parity with Chrome, stripped at build time)
