import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors, fonts, wp} from '../../constants';
import BackHeader from '../../components/BackHeader';
import CustomLabelInput from '../../components/CustomLabelInput';
import CustomButton from '../../components/CustomButton';
import ForgetPasswordValidation from './AuthValidation/ForgetPasswordValidation';
import {ForgetPasswordRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../components/NoInternetModal';
import CustomContainer from '../../components/container';
import crashlytics from '@react-native-firebase/crashlytics';
const ForgetPasswordScreen = ({navigation}) => {
  const [state, setState] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const submitForgetPassword = () => {
    if (!ForgetPasswordValidation(state.email)) {
      return;
    } else {
      let data = {
        email: state.email?.toLowerCase(),
      };

      setIsLoading(true);

      ForgetPasswordRequest(data)
        .then(res => {
          Toast.success('Forget Password', res?.message);
          navigation.navigate('OTPScreen', {
            email: state.email,
            isForget: true,
          });
        })
        .catch(err => {
          console.log('err: ', err);
          Toast.error('Forget Password', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <CustomContainer>
        <BackHeader />

        <Text style={styles.titleTxtStyle}>Forgot Password?</Text>
        <Text style={styles.subTitleStyle}>Enter Registered Email</Text>

        <View style={styles.inputSwitchViewStyle}>
          <CustomLabelInput
            label="Email Address"
            keyboardType="email-address"
            value={state.email}
            onTextChange={txt =>
              setState(prevState => ({...prevState, email: txt}))
            }
            containerStyle={{marginVertical: wp(25)}}
          />

          <View style={styles.submitBtnStyle}>
            <CustomButton
              label="Continue"
              isLoading={isLoading}
              onPress={submitForgetPassword}
              // onPress={() => navigation.navigate('OTPScreen')}
            />
          </View>
        </View>
      </CustomContainer>
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

export default ForgetPasswordScreen;
