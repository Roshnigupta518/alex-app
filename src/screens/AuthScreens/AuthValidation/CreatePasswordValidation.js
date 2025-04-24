import Toast from '../../../constants/Toast';
import checkValidation from '../../../validation';

const CreatePasswordValidation = (password = '', confirmPassword = '') => {
  var passwordErr = checkValidation('registerPassword', password);

  if (passwordErr?.length > 0) {
    Toast.error('Create Password', passwordErr);
    return false;
  } else if (confirmPassword?.length == 0) {
    Toast.error('Create Password', 'Please enter confirm password.');
  } else if (password !== confirmPassword) {
    Toast.error(
      'Create Password',
      'Confirm password is not matching with New Password!',
    );
  } else return true;
};

export default CreatePasswordValidation;
