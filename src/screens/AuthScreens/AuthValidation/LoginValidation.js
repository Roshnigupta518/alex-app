import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const LoginValidation = (
  password = '',
  isPhn = 0,
  countryCode = '',
  mobile = '',
  email = '',
) => {
  var emailErr = checkValidation('email', email);
  var passwordErr = checkValidation('loginPassword', password);
  var phnErr = checkValidation('mobileno', mobile);

  if (isPhn == 0 && countryCode == '') {
    Toast.error('Login', 'Please select country code!');
  } else if (isPhn == 0 && phnErr?.length > 0) {
    Toast.error('Login', phnErr);
  } else if (isPhn != 0 && emailErr?.length > 0) {
    Toast.error('Login', emailErr);
  } else if (passwordErr?.length > 0) {
    Toast.error('Login', passwordErr);
    return false;
  } else return true;
};

export default LoginValidation;
