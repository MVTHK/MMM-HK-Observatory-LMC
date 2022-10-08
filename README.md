# MMM-HK-Observatory

<p style="text-align: center">
    <a href="https://choosealicense.com/licenses/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

A module for [MagicMirror](https://github.com/MichMich/MagicMirror) displaying Hong Kong 9-day Weather Forecast.

Based on [Hong Kong Observatory Open Data API](https://www.hko.gov.hk/en/weatherAPI/doc/files/HKO_Open_Data_API_Documentation.pdf).


## Installation

````javascript
cd modules
git clone https://github.com/Infin1te2021/MMM-HK-Observatory.git
cd MMM-HK-Observatory
npm install
````

## Use this module

It is highly recommended to disable default weather module first in the `config/config.js` file:

````javascript
    /*
    modules: [
        {
            module: "weather",
            position: "top_right",
            config: {
                weatherProvider: "openweathermap",
                type: "current",
                location: "New York",
                locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                apiKey: "YOUR_OPENWEATHER_API_KEY"
                }
            },
            {
            module: "weather",
            position: "top_right",
            header: "Weather Forecast",
            config: {
                weatherProvider: "openweathermap",
                type: "forecast",
                location: "New York",
                locationID: "5128581", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                apiKey: "YOUR_OPENWEATHER_API_KEY"
            }
        }
    ]
    */
````

Then add it to the modules array:

````javascript
    modules: [
        {
            module: "MMM-HK-Observatory",
            position: "top_right",
            config: {
                animationSpeed: 2000,
                updateInterval: 300000, // every 5 minute
                showFooter: true,
            }
        }
    ]
````


## Configuration options