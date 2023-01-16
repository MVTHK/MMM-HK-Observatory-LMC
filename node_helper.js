const NodeHelper = require("node_helper");
const request = require("request");
const Log = require("../../js/logger.js");
var Cylon = require('cylon');

module.exports = NodeHelper.create({
    start: function () {
        Log.log("Starting node helper for: " + this.name);
        this.config = null;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SET_CONFIG" && typeof payload === 'object') {
            this.config = payload;
            var self = this;
            var config = payload;
            var lastGesture = '';
            var lastGestureTime = Date.now();
            var handPresent = false;
            var timer = null;
            var handStartPosition = [];
            var direction = 'no motion';
            var distance = 0;

            Cylon.robot({
                connections: {
                    leapmotion: {
                    adaptor: 'leapmotion'
                    }
                },

                devices: {
                    leapmotion: {
                    driver: 'leapmotion'
                    }
                },

                work: function(device) {
                    device.leapmotion.on('hand', function(hand) {
                    var handOpen = !!hand.fingers.filter(function(f) {
                        return f.extended;
                    }).length;

                    if (handOpen) {
                        direction = 'no motion';
                        distance = 0;

                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            handPresent = false;
                            lastGesture = 'hand_gone';
                            handStartPosition = [];


                            direction = 'no motion';
                            distance = 0;
                            self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_HAND_MISSING');
                        }, 1500);

                        var correctDirection = function(direction) {
                            var orientation = {
                                forward: {
                                    left: 'left',
                                    right: 'right',
                                    down: 'forward',
                                    up: 'back',
                                    forward: 'up',
                                    back: 'down'
                                },
                                up: {
                                    left: 'left',
                                    right: 'right',
                                    down: 'down',
                                    up: 'up',
                                    forward: 'forward',
                                    back: 'back'
                                    }
                                };

                                return orientation[config.orientation][direction];
                            }

                            if (!handPresent) {
                                handPresent = true;
                                lastGesture = 'hand_present';
                                handStartPosition = hand.palmPosition;
                                direction = 'no motion';
                                distance = 0;
                                self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_HAND_DETECTED');
                            }

                            var xdiff = (hand.palmPosition[0] - handStartPosition[0]);
                            var ydiff = (hand.palmPosition[1] - handStartPosition[1]);
                            var zdiff = (hand.palmPosition[2] - handStartPosition[2]);

                            var movements = [
                                {
                                    distance: Math.abs(xdiff),
                                    coordinate: 'x',
                                    type: (xdiff > 0)
                                    ? correctDirection('right')
                                    : correctDirection('left')
                                }, {
                                    distance: Math.abs(ydiff),
                                    coordinate: 'y',
                                    type: (ydiff > 0)
                                    ? correctDirection('down')
                                    : correctDirection('up')
                                }, {
                                    distance: Math.abs(zdiff),
                                    coordinate: 'z',
                                    type: (zdiff > 0)
                                    ? correctDirection('forward')
                                    : correctDirection('back')
                                }
                            ];

                            // sort movements based on furthest distance
                            movements.sort(function(a, b) {
                            return b['distance'] - a['distance'];
                            });

                            // return the movement type with the greatest change in distance
                            direction = movements[0].type;
                            distance = movements[0].distance;

                            if (lastGesture !== direction && distance > 100 && (Date.now() - lastGestureTime) > 1000) {
                                lastGestureTime = Date.now()

                                if (config.watchGestureUp && direction === 'up') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_UP');
                                    lastGesture = direction;
                                } else if (config.watchGestureDown && direction === 'down') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_DOWN');
                                    lastGesture = direction;
                                } else if (config.watchGestureLeft && direction === 'left') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_LEFT');
                                    lastGesture = direction;
                                } else if (config.watchGestureRight && direction === 'right') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_RIGHT');
                                    lastGesture = direction;
                                } else if (config.watchGestureForward && direction === 'forward') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_FORWARD');
                                    lastGesture = direction;
                                }   else if (config.watchGestureBack && direction === 'back') {
                                    self.sendSocketNotification('LEAP_MOTION_GESTURE', 'LEAP_MOTION_SWIPE_BACK');
                                    lastGesture = direction;
                                }
                            }
                        }
                    });

                    if (config.record) {
                        var handFrame = 100;
                        thumbTrackX = [];
                        thumbTrackY = [];
                        thumbTrackZ = [];
                        indexTrackX = [];
                        indexTrackY = [];
                        indexTrackZ = [];
                        middleTrackX = [];
                        middleTrackY = [];
                        middleTrackZ = [];
                        ringTrackX = [];
                        ringTrackY = [];
                        ringTrackZ = [];
                        pinkyTrackX = [];
                        pinkyTrackY = [];
                        pinkyTrackZ = [];
                        device.leapmotion.on('hand', function(frame) {
                            var thumbx = frame.pointables[0].tipPosition[0];
                            var thumby = frame.pointables[0].tipPosition[1];
                            var thumbz = frame.pointables[0].tipPosition[2];
                            var index_fingerx = frame.pointables[1].tipPosition[0];
                            var index_fingery = frame.pointables[1].tipPosition[1];
                            var index_fingerz = frame.pointables[1].tipPosition[2];
                            var middle_fingerx = frame.pointables[2].tipPosition[0];
                            var middle_fingery = frame.pointables[2].tipPosition[1];
                            var middle_fingerz = frame.pointables[2].tipPosition[2];
                            var ring_fingerx = frame.pointables[3].tipPosition[0];
                            var ring_fingery = frame.pointables[3].tipPosition[1];
                            var ring_fingerz = frame.pointables[3].tipPosition[2];
                            var little_fingerx = frame.pointables[4].tipPosition[0];
                            var little_fingery = frame.pointables[4].tipPosition[1];
                            var little_fingerz = frame.pointables[4].tipPosition[2];

                            if (handFrame >= 0) {

                                thumbTrackX.push(thumbx.toString());
                                thumbTrackY.push(thumby.toString());
                                thumbTrackZ.push(thumbz.toString());
                                indexTrackX.push(index_fingerx.toString());
                                indexTrackY.push(index_fingery.toString());
                                indexTrackZ.push(index_fingerz.toString());
                                middleTrackX.push(middle_fingerx.toString());
                                middleTrackY.push(middle_fingery.toString());
                                middleTrackZ.push(middle_fingerz.toString());
                                ringTrackX.push(ring_fingerx.toString());
                                ringTrackY.push(ring_fingery.toString());
                                ringTrackZ.push(ring_fingerz.toString());
                                pinkyTrackX.push(little_fingerx.toString());
                                pinkyTrackY.push(little_fingery.toString());
                                pinkyTrackZ.push(little_fingerz.toString());
                                handFrame = handFrame - 1;

                                if (handFrame % 25 == 0){
                                    self.sendSocketNotification('RAW_GRAPH_DATA', {

                                        thumbx: thumbTrackX,
                                        thumby: thumbTrackY,
                                        thumbz: thumbTrackZ,
                                        index_fingerx: indexTrackX,
                                        index_fingery: indexTrackY,
                                        index_fingerz: indexTrackZ,
                                        middle_fingerx : middleTrackX,
                                        middle_fingery : middleTrackY,
                                        middle_fingerz : middleTrackZ,
                                        ring_fingerx : ringTrackX,
                                        ring_fingery : ringTrackY,
                                        ring_fingerz : ringTrackZ,
                                        little_fingerx : pinkyTrackX,
                                        little_fingery : pinkyTrackY,
                                        little_fingerz : pinkyTrackZ,
                                    })
                                }
                            } else {
                                console.log("record complete");
                            }

                        });
                    }
                }
            }).start();
        }
        this.getData();
    },

    getData: function () {
        const self = this;
        Log.info(this.name + ": Fetching data from Hong Kong Observatory");

        const nineDayWeatherForecastURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en";

        request(nineDayWeatherForecastURL, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                Log.debug(this.name + " :Error getting 9-day Weather Forecast(" + response.statusCode + ")");
                self.sendSocketNotification("ERROR", response.statusCode);
                return;
            }

            const generalSituation = JSON.parse(body).generalSituation;
            const weatherForecast = JSON.parse(body).weatherForecast;
            const updateTime = JSON.parse(body).updateTime;

            self.sendSocketNotification("DATA", {
                generalSituation: generalSituation,
                weatherForecast: weatherForecast,
                updateTime: updateTime
            });
        });
        setTimeout(this.getData.bind(this), this.config.updateInterval);
    }
});
