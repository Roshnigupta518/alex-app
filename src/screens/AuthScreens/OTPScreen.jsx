import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors, fonts, wp, hp} from '../../constants';
import BackHeader from '../../components/BackHeader';
import CustomButton from '../../components/CustomButton';
import OTPTextInput from 'react-native-otp-textinput';
import {OTPVerificationRequest, ResendOTPRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {userDataAction} from '../../redux/Slices/UserInfoSlice';
import {CommonActions} from '@react-navigation/native';
import Storage from './../../constants/Storage';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../components/NoInternetModal';
import crashlytics from '@react-native-firebase/crashlytics';
const OTPScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(2);
  const email = route?.params?.email;
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds === 0) {
        clearInterval(interval);
        return;
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const resendotp = async () => {
    setIsLoading(true);
    let data = {
      email: email?.toLowerCase(),
      verification_type: 'email',
    };

    ResendOTPRequest(data)
      .then(res => {
        if (res.status) {
          setMinutes(2);
          setSeconds(59);
          Toast.success('OTP Verification', res?.message);
        }
      })
      .catch(err => {
        console.log('err: ', err);
        Toast.error('Forget Password', err?.message);
      })
      .finally(() => setIsLoading(false));
  };
  const submitOtp = () => {
    if (code.trim() === '') {
      Toast.error('OTP Verification', 'Please enter OTP');
      return;
    }
    if (code.length == 4) {
      let data = {
        email: route?.params?.email,
        otp: code,
        verification_type: 'email',
      };

      if (seconds == 0) {
        Toast.error('OTP', 'OTP expired, Please resend OTP again.');
      } else {
        setIsLoading(true);
        OTPVerificationRequest(data)
          .then(res => {
            Toast.success('OTP Verification', res?.message);
            if (route?.params?.isForget) {
              navigation.navigate('CreatePasswordScreen', {
                email: route?.params?.email,
              });
            } else {
              Storage.store('userdata', res?.result).then(() => {
                dispatch(userDataAction(res?.result));
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'HomeScreen'}],
                  }),
                );
              });
            }
          })
          .catch(err => {
            console.log('err: ', err, route?.params?.email);
            Toast.error('OTP Verification', err?.message);
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader />

        <Text style={styles.titleTxtStyle}>Verify Yourself</Text>

        <Text style={styles.subTitleStyle}>
          Enter four digit code sent over your registered email{' '}
          {email && (
            <>
              {email
                .substring(0, email.lastIndexOf('@') - 2)
                .replace(/./g, '*')}
              {email.substring(email.lastIndexOf('@') - 2)}
            </>
          )}
        </Text>

        <View style={styles.inputSwitchViewStyle}>
          <OTPTextInput
            tintColor={colors.primaryColor}
            textInputStyle={styles.otpBoxStyle}
            defaultValue={code}
            handleTextChange={code => setCode(code)}
          />

          <View style={styles.submitBtnStyle}>
            <CustomButton
              label="Continue"
              isLoading={isLoading}
              disabled={false}
              onPress={submitOtp}
            />
          </View>
          <View style={styles.sendotp}>
            <Text style={styles.footerTxtStyle}>Didn't Recieve? </Text>
            <TouchableOpacity
              onPress={() => {
                if (seconds == 0) {
                  resendotp();
                }
              }}>
              <Text
                style={styles.TxtStyle(
                  seconds == 0 ? colors.primaryColor : Colors.gray,
                )}>
                {seconds == 0 ? 'Send Again' : 'Resend ' + seconds + ' sec'}
              </Text>
            </TouchableOpacity>
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
    marginHorizontal: wp(30),
  },

  inputSwitchViewStyle: {
    margin: wp(20),
  },

  submitBtnStyle: {
    marginTop: wp(45),
  },
  sendotp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(16),
    justifyContent: 'center',
  },
  otpBoxStyle: {
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.gray,
    borderRadius: 5,
  },
  TxtStyle: color => {
    return {
      fontFamily: fonts.semiBold,
      fontSize: wp(14),
      color: color,
    };
  },
  footerTxtStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(14),
    color: colors.black,
  },
});

export default OTPScreen;
