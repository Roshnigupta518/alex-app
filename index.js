/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import Store from './src/redux/Store';
import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {logoutUserFromStack} from './src/navigation/NavigationRefProp';
import {showMessage} from 'react-native-flash-message';

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
  if (remoteMessage?.data?.type == 'logout') {
    logoutUserFromStack();
  }
});

messaging().onMessage(async remoteMessage => {
  console.log('recieved in foreground', remoteMessage);
  if (remoteMessage?.data?.type == 'logout') {
    showMessage('Sucessfully', remoteMessage?.notification?.body);
    logoutUserFromStack();
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage?.data?.type == 'logout') {
    logoutUserFromStack();
  }
});

// Check whether an initial notification is available
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      if (remoteMessage?.data?.type == 'logout') {
        logoutUserFromStack();
      }
      //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
    }
    // setLoading(false);
  });

const AppWrapper = () => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppWrapper);
