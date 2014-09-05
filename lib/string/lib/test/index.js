import isLuhn from "./lib/is-luhn";
import isEmail from "./lib/is-email";
import isURLy from "./lib/is-urly";
import isPhoneNumber from "./lib/is-phone-number";
import isCreditCard from "./lib/is-credit-card";
import isAlNum from "./lib/is-al-num";
import isLowercase from "./lib/is-lowercase";
import isInteger from "./lib/is-integer";
import isFloat from "./lib/is-float";
import isWordy from "./lib/is-wordy";
import hasNoWhitespace from "./lib/has-no-whitespace";

//various type tests
export default {
    isLuhn :  isLuhn,
    isEmail : isEmail,
    isURLy : isURLy,
    isPhoneNumber : isPhoneNumber,
    isCreditCard: isCreditCard,
    isAlNum : isAlNum,
    isLowercase : isLowercase,
    isInteger : isInteger,
    isFloat : isFloat,
    isWordy : isWordy,
    hasNoWhitespace : hasNoWhitespace
};

export {
    isLuhn,
    isEmail,
    isURLy,
    isPhoneNumber,
    isCreditCard,
    isAlNum,
    isLowercase,
    isInteger,
    isFloat,
    isWordy,
    hasNoWhitespace
};