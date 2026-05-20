document.getElementById('file-input').addEventListener('change', function () {
    const file = this.files[0];
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
        if (links.length === 0) return;

        chrome.storage.local.get('preserveCurrentTabs', ({ preserveCurrentTabs }) => {
            if (preserveCurrentTabs) {
                links.forEach(link => chrome.tabs.create({ url: link }));
                chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
            } else {
                chrome.tabs.query({ currentWindow: true }, existingTabs => {
                    const existingIds = existingTabs.map(t => t.id);
                    links.forEach(link => chrome.tabs.create({ url: link }));
                    chrome.tabs.remove(existingIds);
                });
            }
        });
    };
    reader.readAsText(file);
});
