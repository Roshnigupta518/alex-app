import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const BusinessValidation = (
  businessName = '',
  address = '',
  lat = null,
  lng = null,
  phone = '',
  description = '',
  business_image = null,
  banner_image = null,
  certificate_image = null,
) => {
  var businessNameErr = checkValidation('fullname', businessName);
  var phoneErr = checkValidation('mobileno', phone);

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
  } else if (business_image == null) {
    Toast.error('Business', 'Please upload Business image');
    return false;
  } else if (banner_image == null) {
    Toast.error('Business', 'Please upload Banner Image');
    return false;
  } else if (certificate_image == null) {
    Toast.error('Business', 'Please Upload Buisness Logo.');
    return false;
  } else return true;
};

export default BusinessValidation;
