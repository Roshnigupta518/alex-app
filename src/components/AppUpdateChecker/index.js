import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const AppUpdateChecker = () => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const updateNeeded = await VersionCheck.needUpdate();
        console.log({updateNeeded})
        if (updateNeeded?.isNeeded) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Please update to continue.',
            [
              {
                text: 'Update Now',
                onPress: () => Linking.openURL(updateNeeded.storeUrl),
              },
            ],
            { cancelable: false },
          );
        }
      } catch (error) {
        console.log('Version check failed:', error);
      }
    };

    checkVersion();
  }, []);

  return null;
};

export default AppUpdateChecker;
