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
        links.forEach(link => chrome.tabs.create({ url: link }));
        chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
    };
    reader.readAsText(file);
});
