(() => {
    chrome.runtime.sendMessage({type: "getTheme"}, function(response) {
        if(!response)
            return;

        document.querySelector('html').classList.add('deezer-enhancement');
        document.querySelector('html').classList.add('dark-theme');
    });
})()