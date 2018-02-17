(() => {
	"use strict";

    window.addStartupTask(() => {
		chrome.runtime.sendMessage({type: "getSidebarItemsToRemove"}, function (response) {
			if (!response)
				return;

			window.injectCode(function(...itemsToHide){
				webpackJsonp(["deezerify-filter-menu"], {
					"deezerify/js/deezerify-filter-menu.js": function(e, t, n) {
						"use strict";

						var events = n("./js/_modules/Events.js").a;

						events.subscribeOnce(events.player.playerLoaded, function(e){
							for (var i = 0; i < itemsToHide.length; i++)
								document.querySelector("ul li *[data-type=" + itemsToHide[i] + "]").parentElement.remove();
						});
					},
				}, ["deezerify/js/deezerify-filter-menu.js"]);
			}, response);
		});
    });
})()