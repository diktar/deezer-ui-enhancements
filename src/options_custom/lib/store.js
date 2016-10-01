(function () {
    var Store = this.Store = function (name, defaults) {
        var key;
        this.name = name;
        
        if (defaults !== undefined) {
            for (key in defaults) {
                if (defaults.hasOwnProperty(key) && this.get(key) === undefined) {
                    this.set(key, defaults[key]);
                }
            }
        }
    };
    
    Store.prototype.get = function (name, callback) {
		var that = this;

        if(typeof name == "string") {
			name = "store." + that.name + "." + name;
		}else { // array
			for(var i = 0; i < name.length; i++ ) {
				name[i] = "store." + that.name + "." + name[i];
			}
		}

        chrome.storage.sync.get(name, function(items){
			"use strict";

			if(items){
				var trimmedItems = {}

				for(var key in items)
					trimmedItems[key.substr(7 + that.name.length)] = items[key];

				callback(trimmedItems);
			} else {
				callback(items);
			}
		});
    };
    
    Store.prototype.set = function (name, value) {
        if (value === undefined) {
            this.remove(name);
        } else {
			var object = {};

			object["store." + this.name + "." + name] = value;

            chrome.storage.sync.set(object);
        }
        
        return this;
    };
    
    Store.prototype.remove = function (name) {
        chrome.storage.sync.remove("store." + this.name + "." + name);
        return this;
    };

    Store.prototype.toObject = function (callback) {
        chrome.storage.sync.get(callback);

        return this;
    };
}());
