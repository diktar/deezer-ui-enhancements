var getMatchesForUrl = function (url) {
	"use strict";

	var regexp = new RegExp('.deezer.com/[a-z]+/([a-z]+)/\\d', 'g');

	return regexp.exec(url);
};

chrome.runtime.onInstalled.addListener(function(details) {
	"use strict";

    var settings = new Store("settings");

	if(details.reason == 'install') {
        settings.toObject(function (items) {
            "use strict";

            if (!Object.keys(items).length) {
                settings.set("sidebar_chk_home", true);
                settings.set("sidebar_chk_hearThis", true);
                settings.set("sidebar_chk_favouriteTracks", true);
                settings.set("sidebar_chk_playlists", true);

                settings.set("appearance_theme_dark", false);
            }
        });
    } else if(details.reason == 'update'){
        settings.toObject(function (items) {
            "use strict";

            if(Object.keys(items).indexOf("appearance_theme_dark") === -1)
                settings.set("appearance_theme_dark", false);
        });
    }
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		"use strict";

		var responsePromise = null,
            storedSettings = new Store("settings");

		if(!request || !request.type)
		return;

		switch (request.type){
			case "getSidebarItemsToRemove":
				var items = [],
					settings = {};

				responsePromise = new Promise(function (resolve, reject){
					for(var i = 0; i < manifest.settings.length; i++){
						var setting = manifest.settings[i];

						if(setting.name.startsWith("sidebar"))
							settings[setting.name] = setting.domId;
					}

					if(settings) {
						storedSettings.get(Object.keys(settings), function (storedItems) {
							if (!storedItems)
								return;

							for(var storedSetting in storedItems) {
								if(storedItems[storedSetting])
									delete settings[storedSetting];
							}

							for(var s in settings) {
								items.push(settings[s]);
							}

							resolve(items);
						});
					} else {
						resolve(items);
					}
				});

				break;

			case "getPageByUrl":
				responsePromise = new Promise(function (resolve, reject){
					var matches = getMatchesForUrl(request.url);

					if(matches)
						resolve({ page: matches[1] });
					else
						resolve();
				});

				break;

			case "getTheme":
				responsePromise = new Promise(function (resolve, reject){
                    storedSettings.get("appearance_theme_dark", function(items){
                        var val = items["appearance_theme_dark"];

                        if(val)
                            resolve(items["appearance_theme_dark"]);
                        else
                            reject();
                    })
				});

				break;
		}

		if(sendResponse) {
			responsePromise.then(function (data) {
				sendResponse(data);
			})
		}

		return true;
	});

chrome.runtime.onConnect.addListener(function(port) {
	"use strict";

	chrome.history.onVisited.addListener(function(item){
		"use strict";

		var matches = getMatchesForUrl(item.url);

		if(matches){
			port.postMessage({
				page: matches[1]
			});
		}
	});
});