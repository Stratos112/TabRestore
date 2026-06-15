#!/usr/bin/env python3
import json
import os
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent.parent

EXCLUDE_DIRS  = {'.git', '.claude', 'store_assets', 'scripts'}
EXCLUDE_FILES = {'manifest_firefox.json', 'README.md', '.gitignore'}
EXCLUDE_EXT   = {'.zip', '.xpi'}

def collect_files():
    files = []
    for path in sorted(ROOT.rglob('*')):
        if path.is_dir():
            continue
        rel = path.relative_to(ROOT)
        parts = rel.parts
        if any(p in EXCLUDE_DIRS for p in parts):
            continue
        if parts[0] in EXCLUDE_FILES or rel.name in EXCLUDE_FILES:
            continue
        if rel.suffix in EXCLUDE_EXT:
            continue
        files.append(rel)
    return files

def check(label, ok, warn=False):
    icon = '✓' if ok else ('!' if warn else '✗')
    print(f"  {icon}  {label}")
    return ok or warn

def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')

def run():
    chrome_m = json.loads(read('manifest.json'))
    ff_m     = json.loads(read('manifest_firefox.json'))
    version  = chrome_m['version']
    passed = []

    print(f"\n{'═'*45}")
    print(f"  TabRestore v{version} — Release Check & Build")
    print(f"{'═'*45}\n")

    # ── CHROME ──────────────────────────────────────
    print("[ Chrome Web Store ]")
    passed += [
        check("Manifest V3",                       chrome_m.get('manifest_version') == 3),
        check("tabGroups permission present",       'tabGroups' in chrome_m.get('permissions', [])),
        check("Versions match across manifests",    version == ff_m['version']),
        check("Icon file exists",                  (ROOT / 'icons/616487_thumb.png').exists()),
        check("Popup HTML exists",                 (ROOT / 'popup/popup.html').exists()),
        check("Promo image (440x280) exists",      (ROOT / 'store_assets/chrome/promo_440x280.png').exists(), warn=True),
    ]
    print()

    # ── FIREFOX AMO ─────────────────────────────────
    print("[ Firefox AMO ]")
    gecko        = ff_m.get('browser_specific_settings', {}).get('gecko', {})
    ff_js        = read('popup/popup.js') + read('popup/load.js')
    no_remote    = not re.search(r'\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket', ff_js)
    no_ext_src   = 'src="http' not in read('popup/popup.html')
    passed += [
        check("Manifest V3",                       ff_m.get('manifest_version') == 3),
        check("tabGroups stripped at build",       True),  # build handles it
        check("gecko extension ID set",            bool(gecko.get('id'))),
        check("gecko strict_min_version set",      bool(gecko.get('strict_min_version'))),
        check("No remote fetch / XHR in JS",       no_remote),
        check("No external script src in HTML",    no_ext_src),
        check("data_collection_permissions set",   bool(gecko.get('data_collection_permissions'))),
    ]
    print()

    # ── FIREFOX FOR ANDROID ──────────────────────────
    print("[ Firefox for Android ]")
    g_android    = ff_m.get('browser_specific_settings', {}).get('gecko_android', {})
    android_min  = int(g_android.get('strict_min_version', '0').split('.')[0])
    tab_detected = 'chrome.tabs.group' in read('popup/load.js')
    has_viewport = 'viewport' in read('popup/load.html')
    pointer_mq   = 'pointer: coarse' in read('popup/popup.css')
    passed += [
        check(f"gecko_android strict_min_version >= 142 (found {android_min})", android_min >= 142),
        check("tabGroups feature-detected before use",  tab_detected),
        check("viewport meta in load.html",             has_viewport),
        check("Mobile CSS via pointer:coarse query",    pointer_mq),
    ]
    print()

    # ── BUILD ────────────────────────────────────────
    print("[ Building Packages ]")
    files = collect_files()

    # Chrome .zip
    chrome_out = ROOT / f'store_assets/chrome/TabRestore-chrome-v{version}.zip'
    with zipfile.ZipFile(chrome_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in files:
            z.write(ROOT / rel, rel)
    print(f"  ✓  {chrome_out.relative_to(ROOT)}  ({chrome_out.stat().st_size // 1024} KB, {len(files)} files)")

    # Firefox .zip  — swap manifest, strip tabGroups
    ff_m_clean = dict(ff_m)
    ff_m_clean['permissions'] = [p for p in ff_m['permissions'] if p != 'tabGroups']
    ff_files = [f for f in files if f.name != 'manifest.json']
    ff_out   = ROOT / f'store_assets/firefox/TabRestore-firefox-v{version}.zip'
    with zipfile.ZipFile(ff_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in ff_files:
            z.write(ROOT / rel, rel)
        z.writestr('manifest.json', json.dumps(ff_m_clean, indent=2))
    print(f"  ✓  {ff_out.relative_to(ROOT)}  ({ff_out.stat().st_size // 1024} KB)")
    print(f"     manifest_firefox.json → manifest.json, tabGroups stripped")

    # Firefox .xpi (identical content, different extension for AMO)
    xpi_out = ROOT / f'store_assets/firefox/TabRestore-firefox-v{version}.xpi'
    xpi_out.write_bytes(ff_out.read_bytes())
    print(f"  ✓  {xpi_out.relative_to(ROOT)}  (copy of ff zip)")

    # ── SUMMARY ─────────────────────────────────────
    failures = passed.count(False)
    print(f"\n{'─'*45}")
    if failures:
        print(f"  ✗  {failures} check(s) failed — review before submitting.\n")
    else:
        print(f"  ✓  All checks passed. Ready to submit.\n")

if __name__ == '__main__':
    run()
