
import { RegexType } from "./regex.js";

const checkValidation = (regexType, value, extraValue = null) => {
    if (value?.length == 0)
        return RegexType[regexType]?.emptyError;

    if (regexType === 'anonymous_name') {
        const cleaned = value.trim();

        // First: check length (min 3, max 50)
        if (cleaned.length < 3 || cleaned.length > 50) {
            return 'Screen name must be 3-50 characters';
        }

        // Then: match updated regex (letters only, single space between words)
        if (!RegexType[regexType]?.regex.test(cleaned)) {
            return RegexType[regexType]?.typeError;
        }

        return '';
    }

    if (regexType === 'fullname') {
        const cleaned = value.trim();

        if (cleaned.length < 3 || cleaned.length > 50) {
            return 'Name must be between 3 and 50 characters';
        }

        if (!RegexType[regexType]?.regex.test(cleaned)) {
            return RegexType[regexType]?.typeError;
        }

        return '';
    }

    if (regexType === 'mobileno' || regexType === 'telephone') {
        const onlyDigitsRegex = /^[0-9]+$/;
      
        if (!onlyDigitsRegex.test(value)) {
          return RegexType[regexType]?.invalidCharError || 'Please enter a valid mobile number';
        }
      
        if (value.length < 5 || value.length > 15) {
          return RegexType[regexType]?.lengthError || 'Mobile number must be between 5 to 15 digits';
        }
      
        if (/^0+$/.test(value)) {
          return 'Mobile number cannot be all zeros';
        }
      
        return '';
      }
      

      if (regexType === 'address') {
        if (!value || value.trim() === '') {
            // If empty or only spaces, do NOT show error (valid)
            return ''; // no error
          }
        const cleaned = value?.trim();

        if (cleaned === '') {
            return 'Please enter valid address';
          }
      
        if (cleaned.length < 5 || cleaned.length > 150) {
          return 'Address must be 5-150 characters';
        }
      
        if (/\s{2,}/.test(value)) {
          return 'Please enter a valid address';
        }
      
        if (!RegexType[regexType]?.regex.test(value)) {
          return RegexType[regexType]?.typeError;
        }
      
        return '';
      }

      if (regexType === 'city') {
        if (!value || value.trim() === '') {
            // If empty or only spaces, do NOT show error (valid)
            return ''; // no error
          }
        const cleaned = value?.trim();
      
       
      
        if (cleaned.length < 3 || cleaned.length > 50) {
          return 'City must be 3-50 characters';
        }
      
        if (/\s{2,}/.test(value)) {
          return 'Please enter a valid city';
        }
      
        if (!RegexType[regexType]?.regex.test(value)) {
          return RegexType[regexType]?.typeError;
        }
      
        return '';
      }

      if (regexType === 'state') {
        if (!value || value.trim() === '') {
            // If empty or only spaces, do NOT show error (valid)
            return ''; // no error
          }
        const cleaned = value?.trim();
      
        
      
        if (cleaned.length < 5 || cleaned.length > 150) {
          return 'State name must be 5-150 characters';
        }
      
        if (/\s{2,}/.test(value)) {
          return 'Please enter a valid state name';
        }
      
        if (!RegexType[regexType]?.regex.test(value)) {
          return RegexType[regexType]?.typeError;
        }
      
        return '';
      }

      if (regexType === 'zip') {
        if (!value || value.trim() === '') {
            // If empty or only spaces, do NOT show error (valid)
            return ''; // no error
          }
        const cleaned = value?.trim();
      
      
        if (cleaned.length < 4 || cleaned.length > 10) {
          return 'Zip code must be 4-10 characters';
        }
      
        if (/\s{2,}/.test(value)) {
          return 'Please enter a valid zip code';
        }
      
        if (!RegexType[regexType]?.regex.test(value)) {
          return RegexType[regexType]?.typeError;
        }
      
        return '';
      }
        
      if (regexType === 'bio') {
        if (!value || value.trim() === '') {
            // If empty or only spaces, do NOT show error (valid)
            return ''; // no error
          }
        const cleaned = value?.trim();
     
      
        if (cleaned.length > 150) {
          return 'About yourself must not exceed 150 characters';
        }
      
        if (/\s{2,}/.test(value)) {
          return 'Please enter valid text for about yourself';
        }
      
        if (!RegexType[regexType]?.regex.test(value)) {
          return RegexType[regexType]?.typeError;
        }
      
        return '';
      }
      
      
      

    // if (regexType === 'mobileno') {
    //     const onlyDigitsRegex = /^[0-9]+$/;

    //     if (!onlyDigitsRegex.test(value)) {
    //         return RegexType[regexType]?.invalidCharError || 'Please enter valid mobile number';
    //     }

    //     if (value.length < 5 || value.length > 15) {
    //         return RegexType[regexType]?.lengthError || 'Mobile number must be between 5 to 15 digits';
    //     }

    //     return '';
    // }

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
