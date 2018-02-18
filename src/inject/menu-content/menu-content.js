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

						let removeItems = () => {
							for (let i = 0; i < itemsToHide.length; i++) {
								let el = document.querySelector("ul li *[data-type=" + itemsToHide[i] + "]");

								if(el)
									el.parentElement.remove();
							}
						}
						let events = n("./js/_modules/Events.js").a;

						events.subscribeOnce(events.player.playerLoaded, function(e){
							removeItems();
						});

						// in case when it's already late enough to skip subscription
						removeItems();
					},
				}, ["deezerify/js/deezerify-filter-menu.js"]);
			}, response);
		});
    });
})()