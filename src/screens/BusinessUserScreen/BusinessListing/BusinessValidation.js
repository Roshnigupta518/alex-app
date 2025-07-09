import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const optionalFieldsValidation = {
  instagram: {
    regex: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid Instagram URL',
  },
  twitter: {
    regex: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid Twitter URL',
  },
  youtube: {
    regex: /^https?:\/\/(www\.)?youtube\.com\/@[\w.-]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid YouTube URL',
  },
  facebook: {
    regex: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid Facebook URL',
  },
  tiktok: {
    regex: /^https?:\/\/(www\.)?tiktok\.com\/@[\w._]+\/?(?:\?.*)?$/,
    typeError: 'Please enter valid TikTok URL',
  },
  e_commerce: {
    regex: /^https?:\/\/[^\s]+$/,
    typeError: 'Please enter a valid E-commerce website URL',
  },
  website: {
    regex: /^https?:\/\/[^\s]+$/,
    typeError: 'Please enter a valid Website URL',
  },
};

const getTimeValue = (date) => {
  const d = new Date(date);
  return d.getHours() * 60 + d.getMinutes(); // total minutes
};

const BusinessValidation = (
  businessName = '',
  address = '',
  lat = null,
  lng = null,
  phone = '',
  description = '',
  // business_image = null,
  banner_image = null,
  certificate_image = null,
  twitter = '',
  instagram= '',
  facebook= '',
  tiktok= '',
  youtube= '',
  e_commerce= '',
  website= '',
  fromTime= '',
  toTime= '',
) => {
  var businessNameErr = checkValidation('fullname', businessName);
  var phoneErr = checkValidation('mobileno', phone);

  const optionalFields = {
    twitter,
    instagram,
    facebook,
    tiktok,
    youtube,
    e_commerce,
    website,
  };

  if (businessName?.length == 0) {
    Toast.error('Business', 'Please enter Business name');
  } else if (businessNameErr?.length > 0) {
    Toast.error('Business', businessNameErr);
  } else if (address?.length == 0) {
    Toast.error('Business', 'Please enter your Business location');
    return false;
  } else if (lat == null || lng == null) {
    Toast.error('Business', 'Please enter your Business location');
    return false;
  } else if (phoneErr?.length > 0) {
    Toast.error('Business', phoneErr);
    return false;
  } else if (description?.length == 0) {
    Toast.error('Business', 'Please provide description');
    return false;
  } 
  // else if (business_image == null) {
  //   Toast.error('Business', 'Please upload Business image');
  //   return false;
  // }
   else if (banner_image == null) {
    Toast.error('Business', 'Please upload Banner Image');
    return false;
  } else if (certificate_image == null) {
    Toast.error('Business', 'Please Upload Buisness Logo.');
    return false;
  } 
  for (let key in optionalFields) {
    const value = optionalFields[key];
    const validator = optionalFieldsValidation[key];
    if (value && validator && !validator.regex.test(value)) {
      Toast.error('Business', validator.typeError);
      return false;
    }
  }

  // ✅ Business hours validation
  if ((fromTime && !toTime) || (!fromTime && toTime)) {
    Toast.error('Business', 'Please select both From and To time');
    return false;
  }

  // ✅ Check if ToTime is after FromTime
  const fromTimeMinutes = fromTime ? getTimeValue(fromTime) : null;
  const toTimeMinutes = toTime ? getTimeValue(toTime) : null;
  
  if (fromTimeMinutes !== null && toTimeMinutes !== null && toTimeMinutes <= fromTimeMinutes) {
    Toast.error('Business', 'To time must be greater than From time');
    return false;
  }
  
   return true;
};

export default BusinessValidation;
