import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors, fonts, wp} from '../../constants';
import BackHeader from '../../components/BackHeader';
import MobileNoInput from '../../components/MobileNoInput';
import CustomLabelInput from '../../components/CustomLabelInput';
import CustomButton from '../../components/CustomButton';
import CreatePasswordValidation from './AuthValidation/CreatePasswordValidation';
import {CreatePasswordRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../components/NoInternetModal';
import crashlytics from '@react-native-firebase/crashlytics';
const CreatePasswordScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected === false) {
        // Set internet connection status to false when not connected
        setIsInternetConnected(false);
        console.log('No internet connection');
      } else if (
        state.isConnected === true &&
        state.isInternetReachable !== undefined
      ) {
        // Only update when connection is reachable
        console.log(
          'State of Internet reachability: ',
          state.isInternetReachable,
        );

        // Set connection status based on reachability
        setIsInternetConnected(state.isInternetReachable);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  const submitCreatePassword = () => {
    if (!CreatePasswordValidation(state.newPassword, state.confirmPassword)) {
      return;
    } else {
      setIsLoading(true);
      CreatePasswordRequest({
        email: route?.params?.email,
        password: state.newPassword,
        confirm_password: state.confirmPassword,
      })
        .then(res => {
          Toast.success('Create Password', res?.message);
          navigation.navigate('LoginScreen');
        })
        .catch(err => {
          Toast.error('Create Password', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader />

        <Text style={styles.titleTxtStyle}>Create New Password</Text>

        <Text style={styles.subTitleStyle}>Create New Password</Text>

        <View style={styles.inputSwitchViewStyle}>
          <CustomLabelInput
            label="New Password"
            isPassword={true}
            value={state.newPassword}
            containerStyle={{marginVertical: wp(25)}}
            onTextChange={txt =>
              setState(prevState => ({...prevState, newPassword: txt}))
            }
          />

          <CustomLabelInput
            label="Confirm Password"
            isPassword={true}
            value={state.confirmPassword}
            containerStyle={{marginVertical: wp(25)}}
            onTextChange={txt =>
              setState(prevState => ({...prevState, confirmPassword: txt}))
            }
          />

          <View style={styles.submitBtnStyle}>
            <CustomButton
              isLoading={isLoading}
              label="Continue"
              onPress={submitCreatePassword}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  titleTxtStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(22),
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
  },

  subTitleStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(16),
    color: colors.black,
    textAlign: 'center',
    marginTop: 20,
  },

  inputSwitchViewStyle: {
    margin: wp(20),
  },

  submitBtnStyle: {
    marginTop: wp(45),
  },
});

export default CreatePasswordScreen;
