Module.register("MMM-HK-Observatory", {

	weatherProvider: "HKO",
	// Set the default config properties that is specific to this provider
	defaults: {
		header: "MMM-HK-Observatory",
		reloadInterval: 1 * 60 * 1000, //every 1 minute
		updateInterval: 60 * 1000, // every 60 seconds
		fade: true,
		fadePoint: 0.75,
		showFooter: true,
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

		/*
		if (this.loaded) {
			wrapper.innerHTML = this.fetchedData.generalSituation;
			wrapper.className = "light small bold dimmed";
			return wrapper;
		}
		*/

		const table = document.createElement("weatherForecastTable");
		table.className = "weatherForecastTable"
		table.appendChild(self.createIntro());

		// Create table header row
		table.appendChild(self.createHeader());

		let currentFadeStep = 0;
		let startFade;
		let fadeSteps;

		if (this.config.fade && this.config.fadePoint < 1) {
			if (this.config.fadePoint < 0) {
				this.config.fadePoint = 0;
			}
			startFade = this.fetchedData.weatherForecast.length * this.config.fadePoint;
			fadeSteps = this.fetchedData.weatherForecast.length - startFade;
		}

		let rowElement = null;
		this.fetchedData.weatherForecast.forEach((element, index) => {
			rowElement = self.createDataRow(element);
			if (this.config.fade && index >= startFade) {
				currentFadeStep = index - startFade;
				rowElement.style.opacity = 1 - (1 / fadeSteps) * currentFadeStep;
			}
			table.appendChild(rowElement);
		});

		// Create footer
		table.appendChild(self.createFooter());

		wrapper.appendChild(table);

		// Return the wrapper to the dom.
		return wrapper;
    },

	createIntro: function() {
		const introRow = document.createElement("div");
    introRow.className = "introSituation";
		introRow.innerHTML = this.fetchedData.generalSituation;
		return introRow;
	},

	createHeader: function() {
		const tableHeader = document.createElement("tr");
    tableHeader.className = "headerTableHeaderRow";

		// Forecast date
		const forecastDateHeader = document.createElement("th");
		forecastDateHeader.className = "header forecastDateHeader forecastDate";
    forecastDateHeader.innerHTML = "Forecast Date";

		// Forecast Wind
		const forecastWindHeader = document.createElement("th");
    forecastWindHeader.className = "header forecastWindHeader forecastWind";
    forecastWindHeader.innerHTML = "Forecast Wind";

		// Forecast Weather
		const forecastWeatherHeader = document.createElement("th");
    forecastWeatherHeader.className = "header forecastWeatherHeader forecastWeather";
    forecastWeatherHeader.innerHTML = "Forecast Weather";

		tableHeader.appendChild(forecastDateHeader);
		tableHeader.appendChild(forecastWindHeader);
		tableHeader.appendChild(forecastWeatherHeader);

		return tableHeader;
	},

	createDataRow: function(data){

		const tableDataRow = document.createElement("tr");
		tableDataRow.className = "tableDataRow";

		const date  = document.createElement("td");
		date.className = "forecastDateData forecastDate";
		date.innerHTML = data.forecastDate;

		const wind = document.createElement("td");
		wind.className = "windData wind";
		wind.innerHTML = data.forecastWind;

		const weather = document.createElement("td");
		weather.className = "weatherData weather";
		weather.innerHTML = data.forecastWeather;


		tableDataRow.appendChild(date);
		tableDataRow.appendChild(wind);
    tableDataRow.appendChild(weather);

		return tableDataRow
	},

	createFooter: function() {
		const footerRow = document.createElement("tr");
		footerRow.className = "footerRow";

		const footer = document.createElement("td");
		footer.className = "footer";
		footer.setAttribute("colspan", "5");
		footer.innerHTML = "UPDATED" + ": " + moment().format("dd, DD.MM.YYYY, HH:mm[h]");

		footerRow.appendChild(footer);

		return footerRow;
  },

	socketNotificationReceived: function(notification, payload) {
		if (notification === "DATA") {
			var animationSpped = this.config.animationSpeed;
			console.log(this.loaded)
		if (this.loaded) {
			animationSpped = 0;
		}
		this.fetchedData = payload;
		this.loaded = true;
		this.updateDom(animationSpped);

		} else if (notification === "ERROR") {
			// TODO: Update front-end to display specific error.
		}
	},
});
