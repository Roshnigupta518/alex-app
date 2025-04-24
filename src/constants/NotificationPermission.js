import messaging from '@react-native-firebase/messaging';

const RequestNotificationPermission = async () => {
  new Promise(async (resolve, reject) => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
      resolve(authorizationStatus);
    } else {
      reject('Notification permission not permitted!');
    }
  });
};

export default RequestNotificationPermission;
