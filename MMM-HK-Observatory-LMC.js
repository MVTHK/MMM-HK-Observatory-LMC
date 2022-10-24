Module.register("MMM-HK-Observatory-LMC", {

    weatherProvider: "HKO",
    // Set the default config properties that is specific to this provider
    defaults: {
        header: "MMM-HK-Observatory-LMC",
        animationSpeed: 2000, // 2 * 1000 --> every 1 minute
        updateInterval: 600000, // 10 * 60 * 1000 --> every 10 minute
        showFooter: true,
        maxForecast: 4,
        watchGestureUp: true,
        watchGestureDown: true,
        watchGestureLeft: true,
        watchGestureRight: true,
        watchGestureForward: true,
        watchGestureBack: true,
        orientation: 'up'
    },

    currentPage: 0,
    lastGesture: 'LEAP_MOTION_HAND_MISSING',
    gesture: 'LEAP_MOTION_HAND_MISSING',

    start: function() {
        Log.info("Start module: " + this.name);
        this.loaded = false;
        this.fetchedData = null;
        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    getStyles: function() {
        return["MMM-HK-Observatory-LMC.css", "font-awesome.css"];
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
        wrapper.id = 'MMM-HKO';
        wrapper.className = this.gesture.toLowerCase();

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

        // Create weatherForecastTable
        const table = document.createElement("div");
        table.className = "weatherForecastTable";
        table.appendChild(self.createIntro());

        // Create inner-table
        const innertable = document.createElement("table");
        innertable.className = "innerTable";

        // Create table row and insert it into inner-table
        innertable.appendChild(self.createHeader());

        const maxforecastnum = this.config.maxForecast
        self.maxforecastnumCopy = maxforecastnum

        // Append row element --> Forecast, Temp&Hum, Description
        for (var i = 0; i < this.fetchedData.weatherForecast.length; i++){
            rowElement = self.createDataRow(this.fetchedData.weatherForecast[i])
            if (i < this.fetchedData.weatherForecast.slice(0, maxforecastnum).length){
                rowElement.style.display = '';
                innertable.appendChild(rowElement)
            }
            else{
                innertable.appendChild(rowElement)
            }
        }

        table.appendChild(innertable)

        // Create footer
        table.appendChild(self.createFooter());

        wrapper.appendChild(table);

        // Click event: Click table to display the forcast out of the maxForecast
        table.addEventListener("click", function() {
            self.innertabletrElement = this.getElementsByTagName("tr");
            // If all 9-day forecast are displayed --> Display the default number of forecast (maxForecast)
            if (self.maxforecastnumCopy == 9){
                maxforecastnumCopy = maxforecastnum;
                self.returnMax(self.innertabletrElement, maxforecastnumCopy)
                self.maxforecastnumCopy = maxforecastnum;
            }else{
                self.displayNext(self.innertabletrElement, self.maxforecastnumCopy+ 1)
                self.maxforecastnumCopy += 1
            }
        })
        // Return the wrapper to the dom.
        return wrapper;
    },

    // Forecast general situation
    createIntro: function() {
        const introRow = document.createElement("div");
        introRow.className = "introSituation";
        introRow.innerHTML = "9-day Weather Forecast:" + "<br />" + this.fetchedData.generalSituation;
        return introRow;
    },

    createHeader: function() {
        const tableHeader = document.createElement("tr");
        tableHeader.className = "headerTableHeaderRow";

        // Forecast date Header
        const forecastDateHeader = document.createElement("th");
        forecastDateHeader.className = "forecastDateHeader";
        forecastDateHeader.innerHTML = "Forecast Date";

        // Forecast Icon Header
        const forecastIconHeader = document.createElement("th");
        forecastIconHeader.className = "forecastIconHeader";
        forecastIconHeader.innerHTML = "";

        // Forecast Temperature & Humidity Header
        const forecastTempHumiHeader = document.createElement("th");
        forecastTempHumiHeader.className = "forecastTempHumiHeader";
        forecastTempHumiHeader.innerHTML = "Temperature & Humidity";

        // Forecast Weather General Description Header
        const forecastWeatherDescriptionHeader = document.createElement("th");
        forecastWeatherDescriptionHeader.className = "ForecastWeatherHeader";
        forecastWeatherDescriptionHeader.innerHTML = "Forecast Description";

        tableHeader.appendChild(forecastDateHeader);
        tableHeader.appendChild(forecastIconHeader);
        tableHeader.appendChild(forecastTempHumiHeader);
        tableHeader.appendChild(forecastWeatherDescriptionHeader);

        return tableHeader;
    },

    createDataRow: function(data){

        const tableDataRow = document.createElement("tr");
        tableDataRow.className = "tableDataRow";

        // Date
        const date = document.createElement("td");
        date.className = "dateData";
        date.innerHTML = moment(data.forecastDate).format("ll");

        // Forecast Icon
        const icon = document.createElement("td");
        icon.className = "iconData";
        let srclist = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${data.ForecastIcon}.png`
        icon.innerHTML = `<img src=\ ${srclist} width=\"49px\" height=\"49px\">`;

        // Celsius & Humidity
        const temphumi = document.createElement("td");
        temphumi.className = "temphumiData";
        temphumi.innerHTML = data.forecastMintemp.value + "-" + data.forecastMaxtemp.value + "°C" + "<br />" +
                                                    data.forecastMinrh.value + "-" + data.forecastMaxrh.value + "%";

        // Wind & general Weather description
        const weather = document.createElement("td");
        weather.className = "weatherData";
        weather.style.cssText = "text-align: left";
        weather.innerHTML = data.forecastWind + "<br />" + data.forecastWeather;


        tableDataRow.appendChild(date);
        tableDataRow.appendChild(icon);
        tableDataRow.appendChild(temphumi);
        tableDataRow.appendChild(weather);

        // Row content is hidded by default
        tableDataRow.style.display = "none";

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

    updateStatus: function() {
        document.getElementById('MMM-HKO').className = this.gesture.toLowerCase();
    },

    displayNext: function(element, updatelen) {
        for (var i = updatelen; i < element.length - 1; i++) {
            element[i].style.display = element[i].style.display ? "" : "none";
            updatelen += 1
            break
        }
    },

    displayBefore: function(element, updatelen) {
        for (var i = updatelen; i < element.length - 1; i++) {
            element[i-1].style.display = element[i-1].style.display ? "" : "none";
            updatelen -= 1
            console.log(updatelen)
            return updatelen;
        }
    },

    returnMax: function(element, updatelen) {
        for (var i = updatelen + 1; i < element.length - 1; i++) {
            element[i].style.display = element[i].style.display ? "" : "none";
        }
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;
        var timer = null;

        if (notification === "DATA") {
            var animationSpeed = this.config.animationSpeed;
            if (this.loaded) {
                animationSpeed = 0;
            }
            this.fetchedData = payload;
            this.loaded = true;
            this.updateDom(animationSpeed);
        } else if (notification === 'LEAP_MOTION_GESTURE' && typeof payload === 'string' && payload !== this.lastGesture){
            this.sendNotification(payload);
            this.lastGesture = this.gesture;
            this.gesture = payload;
            this.updateStatus();
            self.innertabletrElement = document.getElementsByClassName("tableDataRow");
            if (payload === 'LEAP_MOTION_SWIPE_DOWN') {
                self.displayNext(self.innertabletrElement, self.maxforecastnumCopy+ 1)
                console.log(self.maxforecastnumCopy);
                self.maxforecastnumCopy += 1
                return
            }
            clearTimeout(timer);
            timer = setTimeout(function() {
                self.sendNotification('LEAP_MOTION_HAND_MISSING');
                self.lastGesture = self.gesture;
                self.gesture = 'LEAP_MOTION_HAND_MISSING';
                self.updateStatus();
            }, 1000)
        } else if (notification === "ERROR") {
                // TODO: Update front-end to display specific error.
        }
    },
});
