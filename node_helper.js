const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({
    start: function () {
        Log.log("Starting node helper for: " + this.name);
        
        const standingsURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php"
    },
})