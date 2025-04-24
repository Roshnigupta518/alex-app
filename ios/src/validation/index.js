import { RegexType } from "./regex.js";

const checkValidation = (regexType, value, extraValue = null) => {
    if (value?.length == 0)
        return RegexType[regexType]?.emptyError;

    else if (RegexType[regexType]?.regex?.test(value) && extraValue==null)
        return '';

    else if(regexType=='confirmPassword' && (extraValue?.length!=0 && (extraValue==value)))
    return '';

    else if(regexType=='confirmPassword' && extraValue=='')
    return 'Please enter confirm password';

    else if(regexType=='confirmPassword' && extraValue!='' && extraValue!=value)
    return 'New Password and Confirm Password are not same';

    else
        return RegexType[regexType]?.typeError;
}

export default checkValidation;