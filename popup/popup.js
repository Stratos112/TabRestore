//Sky Vercautern
//Chrome extension - scraper
//5/6/2024
//saving and loading current tab urls to a .txt file for recovery later. 



/*
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/

//globar vars
var waiting = false;


function listenForClicks() {
    document.addEventListener("click", (e) => {

        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        //call appropriate functions on button press.
        if ((e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT" && e.target.tagName !== "IMG") || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        if (e.target.type === "reset") {
            reset();
        } else if (e.target.id == "save") {
            saveLinks();
        } else if (e.target.id == "load") {
            loadTxt();
        } else if (e.target.id == "settings" || e.target.closest("#settings")) {
            openSettings();
        }
    });
}

//Display the popup's error message, and hide the normal UI.
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

//helper to get current tab object
async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

//when the popup loads, listen.
listenForClicks();


/*
--------------------------------------------------------------
BUTTON METHODS - what happens on each respective button click!
--------------------------------------------------------------
*/

function saveLinks() {
    chrome.storage.local.get(['includePinnedTabs', 'removeDuplicates', 'customFilename'], (s) => {
        const includePinned = s.includePinnedTabs !== false;
        const dedup = !!s.removeDuplicates;

        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            let filtered = includePinned ? tabs : tabs.filter(t => !t.pinned);
            let urls = filtered.map(t => t.url);
            if (dedup) urls = [...new Set(urls)];
            if (urls.length === 0) return;

            const now = new Date();
            const parts = new Intl.DateTimeFormat('en-US', {
               year: 'numeric', month: '2-digit', day: '2-digit',
               hour: '2-digit', minute: '2-digit', second: '2-digit',
               hour12: false
            }).formatToParts(now);
            const dt = parts.reduce((acc, part) => { acc[part.type] = part.value; return acc; }, {});
            const defaultName = `Browser-Tabs-From_${dt.month}-${dt.day}-${dt.year}_${dt.hour}.${dt.minute}.${dt.second}`;

            if (s.customFilename) {
                openSaveOverlay(urls, defaultName);
            } else {
                triggerDownload(urls, defaultName);
            }
        });
    });
}

function triggerDownload(urls, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(urls.join('\n')));
    element.setAttribute('download', filename + '.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function openSaveOverlay(urls, defaultName) {
    const overlay = document.getElementById('save-overlay');
    const input = document.getElementById('filename-input');
    document.getElementById('popup-content').classList.add('hidden');
    overlay.dataset.urls = JSON.stringify(urls);
    overlay.dataset.defaultName = defaultName;
    input.value = defaultName;
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.classList.add('active');
        input.focus();
        input.select();
    }));
}

function closeSaveOverlay() {
    const overlay = document.getElementById('save-overlay');
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => {
        overlay.classList.add('hidden');
        document.getElementById('popup-content').classList.remove('hidden');
    }, { once: true });
}

function loadTxt() {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup/load.html') });
}

function openSettings() {
    const overlay = document.getElementById('settings-overlay');
    const main = document.getElementById('popup-content');
    const isOpen = overlay.classList.contains('active');

    if (!isOpen) {
        chrome.storage.local.get(['preserveCurrentTabs', 'includePinnedTabs', 'removeDuplicates', 'customFilename'], (s) => {
            document.getElementById('preserve-tabs').checked = !!s.preserveCurrentTabs;
            document.getElementById('include-pinned').checked = s.includePinnedTabs !== false;
            document.getElementById('remove-duplicates').checked = !!s.removeDuplicates;
            document.getElementById('custom-filename').checked = !!s.customFilename;
        });
        main.classList.add('hidden');
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => {
            overlay.classList.add('active');
        }));
    } else {
        closeSettings();
    }
}

function closeSettings() {
    const overlay = document.getElementById('settings-overlay');
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => {
        overlay.classList.add('hidden');
        document.getElementById('popup-content').classList.remove('hidden');
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('preserve-tabs').addEventListener('change', (e) => {
        chrome.storage.local.set({ preserveCurrentTabs: e.target.checked });
    });
    document.getElementById('include-pinned').addEventListener('change', (e) => {
        chrome.storage.local.set({ includePinnedTabs: e.target.checked });
    });
    document.getElementById('remove-duplicates').addEventListener('change', (e) => {
        chrome.storage.local.set({ removeDuplicates: e.target.checked });
    });
    document.getElementById('custom-filename').addEventListener('change', (e) => {
        chrome.storage.local.set({ customFilename: e.target.checked });
    });
    document.getElementById('back').addEventListener('click', closeSettings);
    document.getElementById('save-back').addEventListener('click', closeSaveOverlay);
    document.getElementById('confirm-save').addEventListener('click', () => {
        const overlay = document.getElementById('save-overlay');
        const input = document.getElementById('filename-input');
        const urls = JSON.parse(overlay.dataset.urls);
        const filename = input.value.trim() || overlay.dataset.defaultName;
        triggerDownload(urls, filename);
        closeSaveOverlay();
    });
    document.getElementById('filename-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('confirm-save').click();
        if (e.key === 'Escape') closeSaveOverlay();
    });
});

//-----------------------------------------------------------------------------------------------------------------


//helper if reset is pushed
function reset(tabs) {
    chrome.tabs.query({ currentWindow: true }, function (result) {
        result.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                command: "reset",
            });
        });
    });
}


//-----------------------------------------------------------------------------------------------------------------------
