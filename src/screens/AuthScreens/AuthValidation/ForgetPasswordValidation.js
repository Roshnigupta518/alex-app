import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const ForgetPasswordValidation = (email = '') => {
  var emailErr = checkValidation('email', email);

  if (emailErr?.length > 0) {
    Toast.error('Forget Password', emailErr);
  } else return true;
};

export default ForgetPasswordValidation;
