const NodeHelper = require('node_helper');
const request = require('request');
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({
    start: function () {
        Log.log("Starting node helper for: " + this.name);
		this.config = null;
    },

	socketNotificationReceived: function(notification, payload) {
        if (notification == "SET_CONFIG") {
            this.config = payload;
        }

        this.getData();
    },

	getData: function() {
		const self = this;
		Log.info(this.name + ": Fetching data for Hong Kong Observatory")

		const nineDayWeatherForecastURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=sc"

		request(nineDayWeatherForecastURL, function(error, response, body) {
			if (error || (response.statusCode != 200)) {
                Log.debug(this.name + " :Error getting  9-day Weather Forecast(" +
							response.statusCode +
							")");
                self.sendSocketNotification("ERROR", response.statusCode);
                return;
            }

			const generalSituation = JSON.parse(body).generalSituation;
			const weatherForecast = JSON.parse(body).weatherForecast;
			const updateTime = JSON.parse(body).updateTime

			self.sendSocketNotification("DATA", {generalSituation: generalSituation, weatherForecast: weatherForecast, updateTime: updateTime});
		});

		setTimeout(this.getData.bind(this), this.config.updateInterval);
	}
})
