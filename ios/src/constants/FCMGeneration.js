import messaging from '@react-native-firebase/messaging';
import Toast from './Toast';

export const getFCMToken = async () => {
  return new Promise((resolve, reject) => {
    messaging()
      .getToken()
      .then(token => {
        resolve(token);
      })
      .catch(err => {
        console.log('err', err);
        reject();
      });
  });
};
