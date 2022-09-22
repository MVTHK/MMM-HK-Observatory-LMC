Module.register("weatherhk", {

	weatherProvider: "HKO",
      // Set the default config properties that is specific to this provider
	defaults: {
		header: "MMM-HK-Observatory",
		reloadInterval: 1 * 60 * 1000, //every 1 minute
		updateInterval: 30 * 1000, // every 30 seconds
		timeFormat: config.timeFormat,
		initialLoadDelay: 0,
		lang: "en"
	},

	dataType: {
		localWeatherForecast: "flw",
		nineDayWeatherForecast: "fnd",
		currentWeatherReport: "rhrread",
		weatherWarningSummary: "warnsum",
		weatherWarningInformation: "warningInfo",
		specialWeatherTips: "swt"
	},

	lang: {
		english: "en",
		traditionalChinese: "tc",
		simplifiedChinese: "sc"
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

	getDomL: function () {
		const self = this;
        const wrapper = document.createElement("div");
        wrapper.className = "MMM-HKO";
        wrapper.id = "wrapper";
		wrapper.innerHTML = this.fetchedData.generalSituation;
		console.log(this.fetchedData.generalSituation)
		return wrapper;
	},



});
