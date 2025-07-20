import { useEffect } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import InAppUpdates from 'react-native-in-app-updates';
import VersionCheck from 'react-native-version-check';

const AppUpdateChecker = () => {
  useEffect(() => {
    const checkForUpdate = async () => {
      if (Platform.OS === 'android') {
        const inAppUpdates = new InAppUpdates(true); // true enables debug logs

        const result = await inAppUpdates.checkNeedsUpdate();

        if (result.shouldUpdate) {
          inAppUpdates.startUpdate({
            updateType: InAppUpdates.UPDATE_TYPE.IMMEDIATE, // or FLEXIBLE
          });
        }
      } else if (Platform.OS === 'ios') {
        const updateInfo = await VersionCheck.needUpdate();

        if (updateInfo?.isNeeded) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Please update to continue.',
            [
              {
                text: 'Update',
                onPress: () => Linking.openURL(updateInfo.storeUrl),
              },
            ],
            { cancelable: false },
          );
        }
      }
    };

    checkForUpdate();
  }, []);

  return null;
};

export default AppUpdateChecker;
