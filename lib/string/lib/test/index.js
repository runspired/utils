
//various type tests
export default {

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


};