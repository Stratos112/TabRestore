//Sky Vercautern
//Chrome extension
//5/6/2024
//doing stuff in the background // currently unused
//needs to be called by chrome.runtime.sendmessage //NOT chrome.tabs..


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //handle
    //basic async flag, semaphore?
    if (message.command === "redLight") { waiting = "red"; }
    if (message.command === "greenLight") { waiting = "green"; }

    //content processing
    if (message.command === "someFunction") {
        someFunction(message.data, message.tabId);
    }


    //respond
    sendResponse({ message: "done" });
    return true;
});

async function someFunction(links, tabId) {
	console.log("doing someFunction");
}