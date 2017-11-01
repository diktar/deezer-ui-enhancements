(() => {
    chrome.runtime.sendMessage({type: "getSidebarItemsToRemove"}, function (response) {
        if (!response)
            return;

        for (var i = 0; i < response.length; i++)
            document.querySelector("ul li *[data-type=" + response[i] + "]").parentElement.remove();
    });
})()