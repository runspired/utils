import phoneNumber from './lib/phone-number';
import appendUrlProtocol from './lib/append-url-protocol';

export default {

    phoneNumber : phoneNumber,

    //does not necessarily return a valid url, use with isURLy
    appendUrlProtocol : appendUrlProtocol
};

export { phoneNumber, appendUrlProtocol };