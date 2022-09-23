Module.register("MMM-HK-Observatory", {

	weatherProvider: "HKO",
      // Set the default config properties that is specific to this provider
	defaults: {
		header: "MMM-HK-Observatory",
		reloadInterval: 1 * 60 * 1000, //every 1 minute
		updateInterval: 10 * 1000, // every 30 seconds
		timeFormat: config.timeFormat,
		initialLoadDelay: 0,
		lang: "en"
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
		wrapper.innerHTML = this.fetchedData.generalSituation;
		return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA") {
			var reloadInterval = this.config.reloadInterval
			if (this.loaded) {
				reloadInterval = 0
			}
            this.fetchedData = payload;
            this.loaded = true;

        } else if (notification == "ERROR") {
            // TODO: Update front-end to display specific error.
        }
    },

	

	
});


