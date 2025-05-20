
import { RegexType } from "./regex.js";

const checkValidation = (regexType, value, extraValue = null) => {
    if (value?.length == 0)
        return RegexType[regexType]?.emptyError;

    if (regexType === 'mobileno') {
        const onlyDigitsRegex = /^[0-9]+$/;

        if (!onlyDigitsRegex.test(value)) {
            return RegexType[regexType]?.invalidCharError || 'Please enter valid mobile number';
        }

        if (value.length < 5 || value.length > 15) {
            return RegexType[regexType]?.lengthError || 'Mobile number must be between 5 to 15 digits';
        }

        return '';
    }

    else if (RegexType[regexType]?.regex?.test(value) && extraValue == null)
        return '';

    else if (regexType == 'confirmPassword' && (extraValue?.length != 0 && (extraValue == value)))
        return '';

    else if (regexType == 'confirmPassword' && extraValue == '')
        return 'Please enter confirm password';

    else if (regexType == 'confirmPassword' && extraValue != '' && extraValue != value)
        return 'New Password and Confirm Password are not same';

    else
        return RegexType[regexType]?.typeError;
}

export default checkValidation;
