# TabRestore

Save your open tabs to a .txt file and restore them later. That's it.

Works in Chrome and Firefox.

---

## What it does

Two buttons. Save dumps all your current tabs to a timestamped .txt file. Load opens that file and restores the tabs. You can pick whether to replace what you have or add to it.

<image: screenshot of the main popup>

---

## How to use it

**Saving:** Click "Save Tabs". A .txt file downloads automatically. If you have the Custom Filename setting on, it'll ask you to name it first.

**Loading:** Click "Load Tabs". A new tab opens with a file picker. Select your .txt file and your tabs open. That picker tab closes itself when it's done.

<image: screenshot of the load picker tab>

---

## Settings

Click the gear icon in the top right corner to open settings. Click the arrow to go back.

<image: screenshot of the settings panel>

**Keep Current Tabs**
When this is on, loaded tabs get added alongside whatever you already have open. They'll be grouped together in a new tab group (Chrome only) named after the file. When it's off, your current tabs get replaced entirely with the ones from the file.

**Include Pinned Tabs**
On by default. Toggle this off if you have tabs pinned permanently and don't want them ending up in every saved session.

**Skip Duplicate URLs**
When saving, this filters out any tabs sharing the same exact URL — same domain but different pages still get saved separately. When loading, it skips any URLs already open in your current session. Exact match only.

**Custom Filename**
Off by default. Turn this on and you'll get a prompt to name your session before it saves. Leave it blank and it falls back to the timestamp name anyway.

---

## Useful for

**Projects with lots of tabs** — research, development, writing. Save the whole context, close it all, come back to it later exactly where you left off.

**Freeing up memory** — browsers get slow with 40 tabs open. Save the session, close the window, reopen when you need it. Easier than keeping it all open in the background.

**Not quite bookmarks** — bookmarks are for things you go back to regularly. This is for things you're in the middle of that you might never need again after this week. The .txt file lives in your downloads until you delete it.

**Moving sessions around** — the .txt file is just a list of URLs so you can open it on a different machine, a different browser, or send it to someone else entirely.

---

## TODO

These are features I'm planning on adding. Some of them need browser APIs that aren't quite there yet.

**Dedicated save folder** — a setting to choose where your session files go instead of always dumping to Downloads. The save side is doable now but Firefox and Chrome handle file paths differently, so this is on hold until I find an approach that works cleanly for both.

**Default load location** — point the file picker to a specific folder by default when you click Load. Chrome supports this via the File System Access API but Firefox doesn't reliably, so this one's waiting on Firefox catching up.

**Auto-save on close** — automatically save your session when you close a browser window so you always have a recovery point. This needs a background script that Chrome and Firefox handle differently. Shelved for now until I find a cross-browser approach I'm happy with.

**Different file formats** — .txt is simple and human-readable which I like, but something like JSON could store more metadata per tab (title, timestamp, maybe a screenshot). Worth exploring.

**Saved sessions list inside the popup** — instead of digging through your Downloads folder, browse and restore recent sessions directly from the extension. Would use browser storage rather than the filesystem.

---

## Buy me a coffee

If this saved you some time or headache, feel free to throw a few dollars my way.

[tip jar coming soon]

---

All Rights Reserved.
Sky Vercauteren, May 2026
