(() => {
	var that = {}; // let it be the scope of the function

	var observer;

	var ajax = function(body){
		"use strict";

		var apiToken = window.checkForm.value;

		var ajaxParams = {
			method: 'POST',
			credentials: "include"
		};

		ajaxParams.body = body;

		return fetch('/ajax/gw-light.php?api_version=1.0&input=3&api_token=' + apiToken, ajaxParams)
			.then(function(stream) {
				return stream.json();
			}).then(function(data) {
				if(Object.keys(data[0].error).length) {
					if (data[0].error.VALID_TOKEN_REQUIRED) {
						window.checkForm.value = "";

						return ajax(JSON.stringify([{
							method: "deezer.getUserData"
						}]))
						.then(function(data) {
							window.checkForm.value = data[0].result.checkForm;

							return ajax(body);
						});
					}
					else
						alert("Something's gone wrong. Try refreshing the page.");
				}
				else
					return data[0].results;
			});
	};

	var onPlaylistSelect = function(e){
		"use strict";

		var playlistId = e.currentTarget.dataset.playlistId;
		var getSongsAjaxBody = JSON.stringify([{
			"method": "song.getListByAlbum",
			"params": {
				alb_id: that.albumId,
				nb: 500,
				start: 0
			}
		}]);

		ajax(getSongsAjaxBody).then(function(data){
			var songIds = data.data.map(function(item){
				return [item.SNG_ID, 0]; // some weird signature
			})

			var body = JSON.stringify([{
				"method": "playlist.addSongs",
				"params": {
					playlist_id: playlistId,
					songs: songIds
				}
			}]);

			ajax(body).then(function(data){
				if(data)
					alert(songIds.length + " songs were added to playlist")
				else
					alert("something's gone wrong")
			})

			that._playlistsPopup.style.display = 'none';
		});
	};

	var onNewPlaylistClick = function(e){
		"use strict";

		var newPlaylistEl = document.createElement("div");

		// let's copy deezer's popup html
		newPlaylistEl.innerHTML =
			'<div class="modal opened" id="modal" role="dialog" style="display: table;">' +
				'<div class="modal-backdrop"></div>' +
				'<div class="modal-wrapper">' +
					'<div class="modal-dialog modal-large">' +
						'<a class="modal-close icon icon-cancel" href="javascript:void(0);" id="modal-close"></a>' +
						'<div id="modal_playlist_assistant">' +
							'<div class="modal-create-assistant modal-playlist-assistant" role="dialog" aria-labelledby="playlist-assistant-header">' +
								'<div class="modal-header" id="playlist-assistant-header">Create a playlist</div>' +
								'<div class="modal-body playlist-assistant-create">' +
									'<div class="assistant-content clearfix">' +
										'<figure class="thumbnail thumbnail-bordered">' +
											'<div class="picture">' +
												'<img class="picture-img" alt="" height="200" src="https://cdns-images.dzcdn.net/images/playlist/d41d8cd98f00b204e9800998ecf8427e/200x200-000000-80-0-0.jpg" width="200">' +
											'</div>' +
										'</figure>' +
										'<div class="assistant-info">' +
											'<h2 class="heading-4">Need to name it? Right this way:</h2>' +
											'<input type="text" class="form-control form-control-block" maxlength="50" placeholder="Playlist name">' +
											'<div class="form-inline">' +
												'<div class="form-group">' +
													'<span class="form-checkbox playlist-option">' +
														'<label for="private">' +
															'<input type="checkbox" id="private" value="on"><span>Private</span><span class="playlist-option-help">(only you can see this playlist)</span>' +
														'</label>' +
													'</span>' +
												'</div>' +
											'</div>' +
											'<div class="form-inline">' +
												'<div class="form-group">' +
													'<span class="form-checkbox playlist-option">' +
														'<label for="collab"><input type="checkbox" id="collab" value="on">Collaborative</label>' +
													'</span>' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
									'<div class="assistant-content">' +
										'<h2 class="heading-4">Tell us a little about your playlist...</h2>' +
										'<textarea name="playlist-description" maxlength="200" class="form-control form-control-block playlist-description" placeholder="Enter a description (optional)"></textarea>' +
									'</div>' +
								'</div>' +
								'<div class="modal-footer">' +
									'<button class="btn btn-default pull-left" type="button">' +
										'<span class="label">Cancel</span>' +
									'</button>' +
									'<button id="modal_playlist_assistant_submit" type="button" class="btn pull-right btn-primary">' +
										'<span class="label">Create</span>' +
									'</button>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';

		newPlaylistEl.querySelector(".modal-wrapper .modal-close#modal-close").onclick = function(e){
			e.preventDefault();
			e.stopPropagation();

			document.body.removeChild(newPlaylistEl);
		};

		newPlaylistEl.querySelector(".modal-footer button.btn.btn-default.pull-left").onclick = function(e){
			e.preventDefault();
			e.stopPropagation();

			document.body.removeChild(newPlaylistEl);
		};

		newPlaylistEl.querySelector(".modal-footer button.btn.pull-right.btn-primary#modal_playlist_assistant_submit").onclick = function(e){
			e.preventDefault();
			e.stopPropagation();

			var playlistTitle = newPlaylistEl.querySelector(".assistant-info > input").value;
			var playlistDescr = newPlaylistEl.querySelector(".assistant-content > textarea.playlist-description").value;
			var isPrivate = newPlaylistEl.querySelector("input#private").checked;
			var isCollaborative = newPlaylistEl.querySelector("input#collab").checked;

			if(!playlistTitle)
				alert("Please enter title for new playlist");

			var getSongsAjaxBody = JSON.stringify([{
				"method": "song.getListByAlbum",
				"params": {
					alb_id: that.albumId,
					nb: 500,
					start: 0
				}
			}]);

			ajax(getSongsAjaxBody).then(function(data){
				var songIds = data.data.map(function(item){
					return [item.SNG_ID, 0]; // some weird signature
				})

				var body = JSON.stringify([{
					"method": "playlist.create",
					"params": {
						description: playlistDescr,
						title: playlistTitle,
						status: (isPrivate ? 1 : 0) + (isCollaborative ? 2 : 0),
						songs: songIds
					}
				}]);

				ajax(body).then(function(data){
					alert("Playlist created");

					document.body.removeChild(newPlaylistEl);
				});
			});
		};

		document.body.appendChild(newPlaylistEl);
	};

	var renderPlaylistSelectionPopup = function(element, playlists){
		"use strict";

		if(!that._playlistsPopup){
			// let's copy deezer's popup styles
			var outerPopupContainer = document.createElement("div");
			var innerPopupContainer = document.createElement("div");
			var innerPopupHeader = document.createElement("div");
			var outerMenuContainer = document.createElement("div");
			var innerMenuContainer = document.createElement("div");
			var outerPlaylistsContainer = document.createElement("div");
			var innerPlaylistsContainer = document.createElement("div");
			var playlistsUl = document.createElement("ul");

			outerPopupContainer.className = "page-contextmenu is-opened deezerify";
			innerPopupContainer.className = "popover popover-left";
			innerPopupHeader.className = "popover-header";
			innerPopupHeader.innerHTML =
				'<div class="cell cell-infos">' +
					'<h2 class="heading-4 ellipsis">Add to Playlist</h2>' +
				'</div>';
			outerMenuContainer.className = "menu-extended";
			innerMenuContainer.className = "menu-playlist opened";
			outerPlaylistsContainer.className = "playlist-container nano has-scrollbar";
			outerPlaylistsContainer.style.top = '50px';
			innerPlaylistsContainer.className = "nano-content";

			playlistsUl.className = "playlists";

			innerPlaylistsContainer.appendChild(playlistsUl);
			outerPlaylistsContainer.appendChild(innerPlaylistsContainer);
			innerMenuContainer.appendChild(outerPlaylistsContainer);
			outerMenuContainer.appendChild(innerMenuContainer);
			innerPopupContainer.appendChild(innerPopupHeader);
			innerPopupContainer.appendChild(outerMenuContainer);
			outerPopupContainer.appendChild(innerPopupContainer);

			that._playlistsPopup = document.createDocumentFragment();
			that._playlistsPopup.appendChild(outerPopupContainer);
			that._playlistsPopup = that._playlistsPopup.childNodes[0];

			that._playlistsPopup.style.display = 'none';

			document.body.appendChild(that._playlistsPopup);
		}

		var playlistsContainer = that._playlistsPopup.querySelector("ul.playlists");

		playlistsContainer.innerHTML = '';
		playlistsContainer.innerHTML =
			'<li class="menu-item playlist-create" role="button">' +
				'<span class="icon icon-add"></span>' +
				'<span class="label new-playlist-label">New playlist</span>' +
			'</li>';
		playlistsContainer.querySelector(".menu-item.playlist-create").onclick = onNewPlaylistClick;

		for(var i = 0; i < playlists.length; i++){
			var playlist = playlists[i];
			var playlistLi = document.createElement("li");
			var playlistLiInnerIcon = document.createElement("span");
			var playlistLiInnerLabel = document.createElement("span");

			playlistLi.className = "menu-item";
			playlistLi.dataset.playlistId = playlist.PLAYLIST_ID;
			playlistLiInnerIcon.className = "icon icon-playlist";
			playlistLiInnerLabel.className = "label ellipsis";
			playlistLiInnerLabel.textContent = playlist.TITLE;

			playlistLi.appendChild(playlistLiInnerIcon);
			playlistLi.appendChild(playlistLiInnerLabel);

			playlistLi.onclick = onPlaylistSelect;

			playlistsContainer.appendChild(playlistLi);
		}

		// default deezer's popup dimensiona are approx 250pxx300px
		// plus-button dimentions are 35x34
		that._playlistsPopup.style.left = that.targetPosition.left - 250 + "px";
		that._playlistsPopup.style.top = document.querySelector('html').scrollTop + that.targetPosition.top - 150 + 17 + "px";

		if(element.parentElement.className.indexOf('has-contextmenu') == -1)
			element.parentElement.className += " has-contextmenu"; // this item remains with 'hovered' styles

		that._playlistsPopup.style.display = 'block';

		document.onclick = function(){
			blurHoveredThumbnail();

			that._playlistsPopup.style.display = 'none';

			document.onclick = null;
		};
	};

	var blurHoveredThumbnail = function(){
		"use strict";

		var activeEl = document.querySelector('.thumbnail.has-contextmenu');

		if(activeEl)
			activeEl.className = activeEl.className.replace(" has-contextmenu", '');
	};

	var onPlusClick = function(e){
		"use strict";

		e.preventDefault();
		e.stopPropagation();

		blurHoveredThumbnail();

		that.targetPosition = e.target.getBoundingClientRect(); // TODO: consider moving into other place

		var albumRegexp = /album\/(\d+)$/;
		var albumId = albumRegexp.exec(e.currentTarget
            .parentElement.parentElement.parentElement
            .querySelector(".thumbnail-caption > .heading-4 a").href);
		var userId = /\/(\d+)$/.exec(document.querySelector("ul a[data-type=profile]").getAttribute('href'))[1];
		var body = JSON.stringify([{
			"method": "deezer.pageProfile",
			"params": {
				user_id: userId,
				tab: "playlists",
				nb: 40
			}
		}]);

		if(!albumId)
			alert("looks like something gone wrong");
		else
			albumId = albumId[1];

		that.albumId = albumId;

		ajax(body).then(function(data){
			var playlists = data.TAB.playlists.data;

			renderPlaylistSelectionPopup(e.target, playlists);
		});
	};

	var addPlusButtonToAlbums = function(){
		"use strict";

		let albumThumbnails = document.querySelectorAll('.thumbnail-grid .thumbnail');

		if(albumThumbnails){
			for (let i = 0; i < albumThumbnails.length; i++) {
                let thumbnail = albumThumbnails[i];

                if(thumbnail.querySelectorAll(".plus").length)
                    continue; // mutation event might call this code more than once

                if(thumbnail.classList.contains("thumbnail-rounded"))
                    continue; // there aren't albums

				let addElLiContainer = document.createElement("li");
				let addElButton = document.createElement("button");
				let addElSpan = document.createElement("span");

				addElSpan.className = 'icon plus';

                addElButton.className = "action-item-btn";
                addElButton.appendChild(addElSpan);

                addElLiContainer.className = "action-item plus-container";
                addElLiContainer.onclick = onPlusClick;
                addElLiContainer.appendChild(addElButton);

				thumbnail.querySelectorAll("ul.action")[0].append(addElLiContainer);
			}
		}
	};

	var observeDomChanges = function(){
		"use strict";

		if(observer)
			observer.disconnect();

		// select the target node
		var target = document.querySelector('body');

		// create an observer instance
		observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.target.tagName.toLowerCase() == 'div'
						&& (mutation.target.className.toLowerCase() == "page-main")) { // page has changed
					//console.log(mutation);
					addPlusButtonToAlbums();
				} else if(mutation.target.tagName.toLowerCase() == 'div'
					&& mutation.target.className.toLowerCase() == "catalog-content") { // tab has changed
					addPlusButtonToAlbums();
				}else if(mutation.target.tagName.toLowerCase() == 'ul'
					&& mutation.target.className.toLowerCase() == "thumbnail-grid thumbnail-grid-responsive") { // lazy loading of albums
					addPlusButtonToAlbums();
				}
			});
		});

		// configuration of the observer:
		var config = {
			attributes: false,
			childList: true,
			characterData: false,
			subtree: true
		};

		// pass in the target node, as well as the observer options
		observer.observe(target, config);
	};

    window.addStartupTask(() => {
		chrome.runtime.sendMessage({type: "getPageByUrl", url: window.location.href}, function(response) {
			if(!response)
				return;

			if(response.page == 'artist') {
				addPlusButtonToAlbums();

				observeDomChanges();
			}
		});
	});

	// this only works on navigation
	chrome.runtime.connect().onMessage.addListener(function(msg) {
		if(msg.page == 'artist'){
			observeDomChanges();
		}
	});
})()