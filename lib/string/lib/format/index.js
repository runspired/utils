
export default {

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
};