# Skill: release-check

Run the compatibility checklist and build release packages for TabRestore.

## Steps

1. **Run the build script**
   ```
   python3 scripts/build_release.py
   ```
   Show the full output. The script will:
   - Check Chrome Web Store compatibility
   - Check Firefox AMO compatibility
   - Check Firefox for Android compatibility
   - Build versioned .zip and .xpi packages into store_assets/

2. **After the script runs**, scan the output for any `✗` failures and explain what needs fixing if any are found.

3. **If a `!` (warn) item appears** (e.g. missing promo image), note it as a non-blocking reminder.

4. **On success**, remind the user of the submission URLs:
   - Chrome: https://chrome.google.com/webstore/devconsole
   - Firefox AMO: https://addons.mozilla.org/developers/

## Checks performed by the script

**Chrome:** MV3, tabGroups permission, icon/popup files exist, versions match, promo image present.

**Firefox AMO:** MV3, gecko ID + strict_min_version, data_collection_permissions, no remote fetch/XHR, no external script src.

**Firefox for Android:** gecko_android strict_min_version >= 142, tabGroups feature-detected before use, viewport meta in load.html, mobile CSS via pointer:coarse query.

**Build:** Chrome zip (all files + manifest.json), Firefox zip (manifest_firefox.json → manifest.json with tabGroups stripped), Firefox xpi (copy of zip). Output files are versioned by manifest version.
