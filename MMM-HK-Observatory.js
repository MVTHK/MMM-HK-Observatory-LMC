WeatherProvider.register("weatherhk", {
    providerName: "WeatherHK",

      // Set the default config properties that is specific to this provider
	  defaults: {
      weatherProvider: "HKO",
      reloadInterval: 1 * 60 * 1000, //every 1 minute
      updateInterval: 30 * 1000, // every 30 seconds
      timeFormat: config.timeFormat,
      initialLoadDelay: 0,
	  },

    fetchCurrentWeather() {
      this.fetchData(this.getUrl())
			  .then((data) => {

        })
        .catch(function (request) {
          Log.error("Could not load data ... ", request);
        })
        .finally(() => this.updateAvailable());
    },

    fetchWeatherForecast() {

    },
  });