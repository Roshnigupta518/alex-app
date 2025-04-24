import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {colors, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import CustomLabelInput from '../../../components/CustomLabelInput';
import CustomButton from '../../../components/CustomButton';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import checkValidation from '../../../validation';
import Toast from '../../../constants/Toast';
import {ChangePasswordRequest} from '../../../services/Utills';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const ChangePasswordScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    oldPassword: '',
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

  const validateFields = () => {
    let oldPassErr = checkValidation('loginPassword', state.oldPassword);
    let newPassErr = checkValidation('registerPassword', state.newPassword);

    if (oldPassErr.length > 0) {
      Toast.error('Old Password', 'Please Enter Old Password.');
      return false;
    } else if (state.oldPassword == state.newPassword) {
      Toast.error(
        'New Password',
        'Old Password and new password should be different!',
      );
    } else if (state.newPassword.length == 0) {
      Toast.error('New Password', 'Please enter password.');
      return false;
    } else if (newPassErr.length > 0) {
      Toast.error('New Password', newPassErr);
      return false;
    } else if (state.confirmPassword.length == 0) {
      Toast.error('Confirm Password', 'Please enter confirm password.');
      return false;
    } else if (state.newPassword !== state.confirmPassword) {
      Toast.error(
        'Confirm Password',
        'Confirm password is not matching with New Password!',
      );
      return false;
    } else {
      return true;
    }
  };

  const submitPassword = () => {
    if (!validateFields()) {
      return;
    } else {
      let data = {
        old_password: state.oldPassword,
        new_password: state.newPassword,
      };

      setIsLoading(true);
      ChangePasswordRequest(data)
        .then(res => {
          Toast.success('Password', res?.message);
          navigation.goBack();
        })
        .catch(err => {
          Toast.error('Password', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Change Password" />

        <KeyboardAvoidingScrollView>
          <View
            style={{
              marginTop: wp(40),
              margin: wp(20),
            }}>
            <CustomLabelInput
              label="Enter Old Password"
              placeholder="Enter old password"
              isPassword={true}
              value={state.oldPassword}
              onTextChange={txt =>
                setState(prevState => ({...prevState, oldPassword: txt}))
              }
              eyeStyle={{tintColor: colors.black}}
              containerStyle={{marginBottom: wp(30)}}
            />

            <CustomLabelInput
              label="New Password"
              placeholder="Enter new password"
              isPassword={true}
              value={state.newPassword}
              onTextChange={txt =>
                setState(prevState => ({...prevState, newPassword: txt}))
              }
              eyeStyle={{tintColor: colors.black}}
              containerStyle={{marginBottom: wp(30)}}
            />

            <CustomLabelInput
              label="Confirm Password"
              placeholder="Re-enter new password"
              isPassword={true}
              value={state.confirmPassword}
              onTextChange={txt =>
                setState(prevState => ({...prevState, confirmPassword: txt}))
              }
              eyeStyle={{tintColor: colors.black}}
              containerStyle={{marginBottom: wp(30)}}
            />
          </View>

          <CustomButton
            disabled={isLoading}
            isLoading={isLoading}
            label="Save Password"
            onPress={submitPassword}
          />
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default ChangePasswordScreen;
