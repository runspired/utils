/*global HTMLElement */
//patch window.location.origin for Internet Explorer
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

var Utils = window.Utils = {};

Utils.dom = {

    isElement : function (o) {
        return (typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
            );
    },

    //returns true if it is a jQuery object
    isJQuery : function (o) {
        return jQuery && (o instanceof jQuery);
    }
};

Utils.cookie = {

    get : function (name) {
        "use strict";
        var cookies = document.cookie.split(";"),
            index = cookies.length,
            cookieName,
            cookieBody;

        while (index--) {
            cookieName = cookies[index].substr(0, cookies[index].indexOf("="));
            cookieBody = cookies[index].substr(cookies[index].indexOf("=") + 1);
            cookieName = cookieName.replace(/^\s+|\s+$/g, "");
            if (cookieName === name) {
                return decodeURI(cookieBody);
            }
        }

        return false;
    },

    set : function (name, value, expires) {
        "use strict";
        var date = new Date();
        date.setDate(date.getDate() + expires);
        document.cookie = name + "=" + encodeURI(value) + ((expires === null) ? "" : "; expires=" + date.toUTCString());
    },

    del : function (name) {
        "use strict";
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};

Utils.array = {

    inArray : function (a, v) {
        "use strict";
        return !!~a.indexOf(v);
    }

};

Utils.object = {
    keys : function (o) {
        if (!!Object.keys) {
            return Object.keys(o);
        }
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        var k = [],
            p;

        for (p in o) {
            if (Object.prototype.hasOwnProperty.call(o, p)) {
                k.push(p);
            }
        }

        return k;

    },

    length : function (o) {
        return Utils.object.keys(o).length;
    }
};

Utils.string = {

    charAt : function (str, i) {
        return str.substring(i, i + 1);
    },

    capFirstLetter : function (s) {
        "use strict";
        return s.charAt(0).toUpperCase() + s.slice(1);
    },

    pluralize : function (s) {
        "use strict";
        var plural = s;
        if (plural.slice(-1) === 'y') {
            plural = plural.slice(0, -1) + 'ies';
        } else if (plural.slice(-1) === 's' && plural.slice(-2) !== 'es') {
            plural = plural.slice(0, -1) + 'es';
        } else {
            plural = plural + 's';
        }

        return plural;
    },

    underscoreToWords : function (s) {
        "use strict";
        return s.replace(/_/g, ' ');
    },

    capitalizeWords : function (sentence) {
        "use strict";
        return sentence.split(' ')
            .map(function (word) {
                return Utils.string.capFirstLetter(word);
            })
            .join(' ');
    },

    //filter everything but 0-9 characters from a string
    filterDigits : function (str) {
        return str.replace(/[^\d]/g, '');
    },

    //remove beginning and ending whitespace
    trim : function (str) {
        str = str || '';
        return str.replace(/^\s+|\s+$/g, '');
    },

    get : {
        protocol : function (str) {
            var firstSlash = str.indexOf('/'),
                secondSlash = str.indexOf('/', firstSlash + 1);
            if (firstSlash !== -1) {
                if (secondSlash !== -1 && secondSlash - firstSlash === 1) {
                    return str.substr(0, secondSlash + 1);
                }
                if (firstSlash === 0) {
                    return '/';
                }
                return '';
            }
            return '';
        }
    },

    //various type tests
    test : {

        //checksum for credit cards and bank routing numbers
        isLuhn :  function (cc) {
            var sum = 0,
                i;
            for (i = cc.length - 2; i >= 0; i -= 2) {
                sum += [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][parseInt(Utils.string.charAt(cc, i), 10)];
            }
            for (i = cc.length - 1; i >= 0; i -= 2) {
                sum += parseInt(Utils.string.charAt(cc, i), 10);
            }
            return (sum % 10) == 0;
        },

        //see http://www.regular-expressions.info/email.html for discussion
        isEmail : function (str) {
            return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(str);
        },

        //perfect url detection is hard, this just checks that there's some semblance of a TLD
        isURLy : function (str) {
            var regex = /^(http\:\/\/)?[a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2}/;
            return regex.test(str);
        },

        //validate a US phone number
        isPhoneNumber : function (str) {
            return (/^(\+?1[ \.-]?|1[ \.-]?)?(\([2-9]\d{2}\)|[2-9]\d{2})[ \.-]?\d{3}[ \.-]?\d{4}/).test(str);
        },

        //validate (syntactically) a credit card number
        isCreditCard: function (value, type) {
            value = Utils.string.filterDigits();
            if (Utils.string.test.isLuhn(value)) {
                var valids = [
                    ["amex", "34", 15],
                    ["amex", "37", 15],
                    ["disc", "6011", 16],
                    ["mc", "51", 16],
                    ["mc", "52", 16],
                    ["mc", "53", 16],
                    ["mc", "54", 16],
                    ["mc", "55", 16],
                    ["visa", "4", 13],
                    ["visa", "4", 16]
                ], i = valids.length;
                type = type.toLowerCase();
                while (i--) {
                    if (valids[i][0] == type && value.indexOf(valids[i][1]) == 0 && valids[i][2] == value.length) {
                        return true;
                    }
                }
            }
            return false;
        },

        //validate that a string contains only alpha numeric characters
        isAlNum : function (str) {
            return (/^[a-zA-Z0-9]+$/).test(str);
        },

        //validate that a string contains only lower case characters
        //numbers and symbols are ignored
        isLowercase : function (str) {
            return !/[A-Z]/.test(str);
        },

        //validate that a string contains only 0-9 chars
        isInteger : function (str) {
            return (/^[0-9]+$/).test(str);
        },

        //validate that a string contains only 0-9 chars and a single decimal point
        isFloat : function (str) {
            return (/^[0-9]+(\.[0-9]*)?$/).test(str);
        },

        //validate that a string is only a word tokens (no spaces) \w\-
        isWordy : function (str) {
            return (/^[\w\-]+$/).test(str);
        },

        //validate that a string does not contain whitespace
        hasNoWhitespace : function (str) {
            return !(/\s/).test(str);
        }


    },

    format : {

        phoneNumber : function (num, format) {

            num = num || '';

            /*
             formats
             ----------------------------
             dot    :   1.234.567.8910
             dash   :   1-234-567-8910 (default)
             pretty :   +1 (234) 567-8910
             */
            var formats = {
                    dot  : ['1', '.', '.', '.'],
                    dash : ['1', '-', '-', '-'],
                    pretty : ['+1 ', '(', ') ', '-'],
                    plain : ['', '', '', ''],
                    'us-plain' : ['1', '', '', '']
                },

            //select correct format
                form = (format && formats.hasOwnProperty(format)) ?
                    formats[format] : formats.dash,

            //strip any existing formatting
                numb = Utils.string.filterDigits(num),

            //0 if 1 is not present, 1 otherwise
                adj = 0;

            if (Utils.string.charAt(numb, 0) === '1') {
                adj = 1;
            }
            return numb.replace(/^1?(\d{0,3})(\d{0,3})(\d{0,4})?$/, function (match, p1, p2, p3) {
                var formatted = form[0] + form[1] + p1;
                if (p2) {
                    formatted += form[2] + p2;
                }
                if (p3) {
                    formatted += form[3] + p3;
                }
                return formatted;
            });
        },

        //does not necessarily return a valid url, use with isURLy
        appendUrlProtocol : function (str, protocol) {
            protocol = protocol || 'http://';

            function getProtocol(str) {
                var firstSlash = str.indexOf('/'),
                    secondSlash = str.indexOf('/', firstSlash + 1);
                if (firstSlash !== -1) {
                    if (secondSlash !== -1 && secondSlash - firstSlash === 1) {
                        return str.substr(0, secondSlash + 1);
                    }
                    if (firstSlash === 0) {
                        return '/';
                    }
                    return '';
                }
                return '';
            }

            var protocol_existing = getProtocol(str);

            //check for existing protocol
            if (!protocol_existing) {
                return protocol + str;
            }
            if (protocol_existing !== 'https://' && protocol_existing !== 'http://') {
                return str.replace(protocol_existing, protocol);
            }
            return str;

        }
    }

};



Utils.animate = {

    Interval : function (callback, time) {
        "use strict";
        var delay = time ? parseInt(time, 10) : 0,

        //stores the time of last callback execution for
        // play/pause behavior and firefox shunt
            lastExecution = (new Date()).getTime(),

            timeout = false,

        //execute the callback and setup the next one
            once = function () {
                callback();
                timeout = setTimeout(
                    once,
                    delay
                );
            },

        //shunt for firefox, which executes setTimeout
        // up to 50% early
            checkExecution = function () {
                var time = (new Date()).getTime() - lastExecution;
                if (time >= delay) {
                    return true;
                }
                timeout = setTimeout(
                    once,
                    time
                );
                return false;
            },

        //stores the amount of time elapsed prior to a pause
            timeElapsed = 0;

        //initiate the callback loop
        timeout = setTimeout(
            once,
            delay
        );

        Object.defineProperty(
            this,
            'delay',
            {
                get : function () { return delay; },
                set : function (v) { delay = parseInt(v, 10); }
            }
        );

        this.reset = function () {
            if (timeout !== false) {
                clearTimeout(timeout);
                timeout = false;
                timeElapsed = 0;
                lastExecution = (new Date()).getTime();
                timeout = setTimeout(once, delay);
            }
        };

        this.pause = function () {
            if (timeout !== false) {
                clearTimeout(timeout);
                timeout = false;
                timeElapsed = (new Date()).getTime() - lastExecution;
            }
        };

        this.play = function () {
            lastExecution = (new Date()).getTime() - timeElapsed;
            timeout = setTimeout(once, Math.max(0, delay - timeElapsed));
            timeElapsed = 0;
        };

    }

};
