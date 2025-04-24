import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const SetupProfileValidation = (
  profile_image = null,
  anonyms_name = '',
  name = '',
  password = '',
  confirmPassword = '',
  isPhone = true,
  countryCode = '',
  phn = '',
  email = '',
) => {
  var anonymsErr = checkValidation('anonymous_name', anonyms_name);
  var nameErr = checkValidation('fullname', name);
  var emailErr = checkValidation('email', email);
  var passwordErr = checkValidation('registerPassword', password);
  var phnErr = checkValidation('mobileno', phn);

  if (profile_image == null) {
    Toast.error('Profile Image', 'Please upload your profile picture');
  } else if (anonymsErr?.length > 0) {
    Toast.error('Setup Profile', anonymsErr);
  } else if (nameErr?.length > 0) {
    Toast.error('Setup Profile', nameErr);
    return false;
  } else if (isPhone == null) {
    Toast.error('Setup Profile', 'Please select mobile or email!');
  } else if (isPhone && countryCode == '') {
    Toast.error('Setup Profile', 'Please select country code!');
  } else if (isPhone && phnErr?.length > 0) {
    Toast.error('Setup Profile', phnErr);
  } else if (emailErr?.length > 0) {
    Toast.error('Setup Profile', emailErr);
  } else if (passwordErr?.length > 0) {
    Toast.error('Setup Profile', passwordErr);
    return false;
  } else if (confirmPassword?.length == 0) {
    Toast.error('Setup Profile', 'Please enter confirm password.');
  } else if (password !== confirmPassword) {
    Toast.error(
      'Setup Profile',
      'Confirm password is not matching with New Password!',
    );
  } else return true;
};

export default SetupProfileValidation;
