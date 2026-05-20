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
        links.forEach(link => chrome.tabs.create({ url: link }));
        window.close();
    };
    reader.readAsText(file);
});
