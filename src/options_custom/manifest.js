this.manifest = {
    "name": "Deezer UX Improver Options",
    "icon": "icon.png",
    "settings": [
        // Sidebar Menu
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_home",
            "type": "checkbox",
            "label": "Home",
            "domId": "home"
        },
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_hearThis",
            "type": "checkbox",
            "label": "Hear this",
			"domId": "feed"
        },
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_favouriteTracks",
            "type": "checkbox",
            "label": "Favourite Tracks",
			"domId": "loved"
        },
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_playlists",
            "type": "checkbox",
            "label": "Playlists",
			"domId": "playlists"
        },
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_albums",
            "type": "checkbox",
            "label": "Albums",
			"domId": "albums"
        },
        {
            "tab": "Sidebar Menu",
            "group": "Items",
            "name": "sidebar_chk_apps",
            "type": "checkbox",
            "label": "Apps",
			"domId": "apps"
        },
        // Sidebar Menu end

        // Actions
	    {
		    "tab": "Actions",
		    "group": "Albums",
		    "name": "actions_play_descr",
		    "type": "description",
		    "text": "There is an action added to albums that allows you to add songs to the playlist without opening the album. Currently it can't be turned off."
	    },
	    // Actions end
    ]
};
