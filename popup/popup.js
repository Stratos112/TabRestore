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

        // download 
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(links));
        element.setAttribute('download', "lnks" + Math.random() + ".txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });
}

async function loadTxt(){
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    var content;
    var links = [];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            
            content = reader.result;
            content.toString().split('\n').forEach(line => {
                links.push(line);
            });

            links.forEach((link) =>{
            chrome.tabs.create({
                url: link,
                });
        });
      }
        reader.readAsText(file);
    }
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
