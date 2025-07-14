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
    return false;
  } else if (businessNameErr?.length > 0) {
    Toast.error('Business', businessNameErr);
    return false;
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
    const raw = optionalFields[key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    const validator = optionalFieldsValidation[key];
  
    console.log({ key, value, validator }); // ✅ Debug per field
  
    if (value && validator && !validator.regex.test(value)) {
      Toast.error('Business', validator.typeError);
      return false;
    }
  }
  

 // ✅ Only validate if at least one value is entered
if (fromTime || toTime) {
  // ⛔ One is missing — show error
  if (!fromTime || !toTime) {
    Toast.error('Business', 'Please select both From and To time');
    return false;
  }

  const from = new Date(fromTime);
  const to = new Date(toTime);

  // ⛔ "To" must be after "From"
  if (from >= to) {
    Toast.error('Business', 'To time must be greater than From time');
    return false;
  }
}
  
   return true;
};

export default BusinessValidation;
