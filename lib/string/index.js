import charAt from "./lib/char-at";
import capFirstLetter from "./lib/cap-first-letter";
import pluralize from "./lib/pluralize";
import underscoreToWords from "./lib/undescore-to-words";
import capitalizeWords from "./lib/capitalize-words";
import filterDigits from "./lib/filter-digits";
import trim from "./lib/trim";
import get from "./lib/get/index";
import test from "./lib/test/index";
import format from "./lib/format/index";

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