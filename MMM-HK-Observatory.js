Module.register("MMM-HK-Observatory", {

	weatherProvider: "HKO",
	// Set the default config properties that is specific to this provider
	defaults: {
		header: "MMM-HK-Observatory",
		reloadInterval: 1 * 60 * 1000, //every 1 minute
		updateInterval: 5 * 1000, // every 15 seconds
	},

	start: function() {
		Log.info("Start module: " + this.name);
		this.loaded = false;
		this.fetchedData = null;

		this.sendSocketNotification("SET_CONFIG", this.config);
	},

	getStyles: function() {
		return["MMM-HK-Observatory.css", "font-awesome.css"];
	},

	getHeader: function() {
        if (!this.loaded || this.error) {
            return this.config.header;
        } else {
            return this.config.header + " " + this.fetchedData.updateTime;
        }
    },

	getDom: function () {
		const self = this;
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-HKO";
        wrapper.id = "wrapper";

		if (!this.loaded) {
            wrapper.innerHTML ="LOADING";
            wrapper.className = "light small dimmed";
            return wrapper;
        }

		if (this.error) {
            wrapper.innerHTML = "ERROR";
            wrapper.className = "light small dimmed";
            return wrapper;
        }

		if (this.loaded) {
			wrapper.innerHTML = this.fetchedData.generalSituation;
			wrapper.className = "light small dimmed";
			return wrapper;
		}


	},

	socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA") {
			var updateInterval = this.config.updateInterval
			console.log(this.loaded)
			if (this.loaded) {
				updateInterval = 30 * 1000
			}
			this.fetchedData = payload;
            this.loaded = true;
			this.updateDom(updateInterval);
        } else if (notification === "ERROR") {
            // TODO: Update front-end to display specific error.
        }
    },
});
