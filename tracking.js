'use strict';

var TRACKING = {
    getCurrentCookieLength: document.cookie.split('; ').length,
    getCurrentCookieName: document.cookie.split('='),
    storeCurrentCookie: null,
    getCurrentCookieI: 0,
    getCurrentCookie: function () {
        var _self = this;
        //Get any current cookie we have set
        for (_self.getCurrentCookieI; _self.getCurrentCookieI < _self.getCurrentCookieLength; _self.getCurrentCookieI++) {
            _self.storeCurrentCookie = _self.getCurrentCookieName[_self.getCurrentCookieI];
        }
    },

    init: function () {
        var cookieObj = {};
        //Value names within cookie JSON
        var urlArray = [];
        var urlLength = urlArray.length;
        var urlI = 0;
        var _self = this;


        //Cache DOM element we change value of
        //Left blank to add own if desired
        var sel2 = {
        };

        //Get any current cookie we have set
        _self.getCurrentCookie();



        //Loop that sets values based of of url
        for (urlI; urlLength > urlI; urlI++) {
            if (_self.getUrlParameters()[urlArray[urlI]]) {
                cookieObj[urlArray[urlI]] = _self.getUrlParameters()[urlArray[urlI]];
            }
        }


        //Populate values
        var populateValues = function () {
            var read = _self.readCookie(_self.storeCurrentCookie);
            var populateI = 0;

            //Loop through the array and assign values if available
            for (populateI; urlLength > populateI; populateI++) {
                if (JSON.parse(read)[urlArray[populateI]]) {
                    if (sel2[urlArray[populateI]]) {
                        sel2[urlArray[populateI]].value = _self.regExOutputValue(JSON.parse(read)[urlArray[populateI]]);
                    }
                }
            }
        };


        //If cookie exits, populate value and don't create cookie
        if (_self.readCookie(_self.storeCurrentCookie)) {
            populateValues();
        } else if (_self.getUrlParameters()['lead_id']) {
            //If not, create cookie
            _self.setCookie(cookieObj.lead_id, cookieObj, 30);

            //refresh to show results
            location.reload();
        }
    },
    getUrlParameters: function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    },
    setCookie: function (name, value, exdays) {
        var d = new Date();
        var expires;

        //Specific days till espies
        if (exdays) {
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        }
        //If not, we set it for one day
        else {
            d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        }

        expires = 'expires=' + d.toUTCString();

        document.cookie = name + '=' + JSON.stringify(value) + '; ' + expires;
        if (document.cookie)
            return true;
    },
    readCookie: function (name, c, C, i) {
        var cookies;
        if (cookies) {
            return cookies[name];
        }

        c = document.cookie.split('; ');
        cookies = {};

        for (i = c.length - 1; i >= 0; i--) {
            C = c[i].split('=');
            cookies[C[0]] = C[1];
        }

        return cookies[name];
    },
    regExOutputValue: function (value) {
        return value.replace(/[_+]/g, ' ');
    }
};


//Fire off init TRACKING
TRACKING.init();
