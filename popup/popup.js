//Sky Vercautern
//Chrome extension - scraper
//5/6/2024
//doing stuff in the a tual popup



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
        if ((e.target.tagName !== "BUTTON" && e.target.TagName !== "INPUT") || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        if (e.target.type === "reset") {
            reset();
        } else if (e.target.id == "save") {
            saveLinks();
        }else if(e.target.id == "load"){
            loadTxt();
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

//helper if "save" is clicked""
function saveLinks(tabs) {
    //initialize an array of links (strings)
    var links = "";

    //get all the tabs in the current window
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(function (tab) {
            links += (tab.url + "\n");
        });

        //get timestamp
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
           year: 'numeric', month: '2-digit', day: '2-digit',
           hour: '2-digit', minute: '2-digit', second: '2-digit',
           hour12: false
        }).formatToParts(now);

        const dt = parts.reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
        }, {});

        const formatted = `${dt.month}-${dt.day}-${dt.year}_${dt.hour}.${dt.minute}.${dt.second}`;

        // download 
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(links));
        element.setAttribute('download', "Browser-Tabs-From_" + formatted + ".txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });
}

function loadTxt() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', function () {
        const file = input.files[0];
        document.body.removeChild(input);
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (e) {
            var links = [];
            e.target.result.toString().split('\n').forEach(line => {
                const cleanLine = line.trim();
                if (cleanLine) {
                    const formattedUrl = cleanLine.startsWith('http') ? cleanLine : `https://${cleanLine}`;
                    links.push(formattedUrl);
                }
            });
            links.forEach((link) => {
                chrome.tabs.create({ url: link });
            });
        };
        reader.readAsText(file);
    });

    input.click();
}

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
