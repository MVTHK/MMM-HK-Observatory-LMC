# MMM-HK-Observatory

<p style="text-align: center">
    <a href="https://choosealicense.com/licenses/apache-2.0/"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
</p>

A module for [MagicMirror](https://github.com/MichMich/MagicMirror) displaying Hong Kong 9-day Weather Forecast.

Based on [Hong Kong Observatory Open Data API](https://www.hko.gov.hk/en/weatherAPI/doc/files/HKO_Open_Data_API_Documentation.pdf).

## Screenshots
| ![screenshot1](img/readme/default.PNG)| ![screenshot2](img/readme/9-day%20forecast.PNG) |
| --- |-------------------------------------------------|
| Default | 9-day Forecast                                  |

## Installation

````javascript
cd modules
git clone https://github.com/Infin1te2021/MMM-HK-Observatory.git
cd MMM-HK-Observatory
npm install
````

## Use this module

Add the code below to the modules array in the `config/config.js` file:

````javascript
    modules: [
        {
            {
                module: "MMM-HK-Observatory",
                header: "MMM-HK-Observatory",
                position: "top_right",
                config: {
                    animationSpeed: 2000,
                    updateInterval: 600000,
                    maxForecast: 4,
                    showFooter: true,
                }
            }
        }
    ]
````


## Configuration options
| Option           | Type | Default | Description                                                             |
|------------------| --- | --- |-------------------------------------------------------------------------|
| `animationSpeed` | `int` | `2000` | Time to display when startup [milliseconds] (2 second )                 |
| `updateInterval` | `int` | `600000` | Frequency to update the forecast [milliseconds] (10 minutes )           |
| `maxForecast` | `int` | `4` | The maximum number of weather forecast day will be displayed by default |
| `showFooter` | `boolean` | `true` | Last update time                                                        |

