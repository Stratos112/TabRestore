//Sky Vercautern
//Chrome extension - media processing file
//5/10/2024
//injected into tabs automatically via manifest
//use chrome.tabs.sendmessage to call funcs in this file once moving to 'http://blankwebsite.com'
//currently unused. but a good example of injecting script into a new page!! Just a scaffold.


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	//handle
	if (message.command === "") {

		//clear the page.
		parent = document.getElementsByTagName('body')[0];
		while (parent.firstChild) {
			parent.firstChild.remove();
		}

		//show new html
		var div = document.createElement("div");
		div.setAttribute("id", "main");
		document.body.appendChild(div);
		div.innerText = "test123";
		var linkLabel = document.createElement("div");
		linkLabel.setAttribute("id", "linkLabel");
		document.body.appendChild(linkLabel);
		div.innerText = "test123";

		doSomething(message.data)
	}

	//respond
	sendResponse({ message: "done" });
	return true;
});

async function doSomething(links) {
	document.getElementById("main").innerText = "Doing something";

}