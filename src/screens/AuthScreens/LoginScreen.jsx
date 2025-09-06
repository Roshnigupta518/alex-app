import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import {colors, fonts, wp} from '../../constants';
import BackHeader from '../../components/BackHeader';
import MobileNoInput from '../../components/MobileNoInput';
import CustomLabelInput from '../../components/CustomLabelInput';
import CustomButton from '../../components/CustomButton';
import LoginValidation from './AuthValidation/LoginValidation';
import {LoginUserRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {userDataAction} from '../../redux/Slices/UserInfoSlice';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import Storage from './../../constants/Storage';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {getFCMToken} from '../../constants/FCMGeneration';
import NoInternetModal from '../../components/NoInternetModal';
import crashlytics from '@react-native-firebase/crashlytics';
import CustomCheckBox from '../../components/CustomCheckbox';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [selectedTab, setSelectedTab] = useState(0);
  const [fcmToken, setFcmToken] = useState('');
  const [callingCode, setCallingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    email: '',
    mobileNo: '',
    password: '',
  });
  const [isChecked, setIsChecked] = useState(false);
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
  const clearInputs = () => {
    setState(prevState => ({
      ...prevState,
      email: '',
      mobileNo: '',
      password: '',
    }));
  };

  const submitLogin = () => {
   
    if (
      !LoginValidation(
        state.password,
        selectedTab,
        callingCode,
        state.mobileNo,
        state.email,
      )
    ) {
      return;
    } 
    
    // 🔹 Agar email/password valid hai to Privacy Policy check karo
      if (!isChecked) {
        Toast.error("Login", "Please accept Privacy Policy to continue.");
        return;
      }
    
    // else {
      let data = {
        email:
          selectedTab == 0
            ? '+' + callingCode?.replace('+', '') + state.mobileNo
            : state.email?.toLowerCase(),
        password: state.password,
        type: Platform.OS === 'android' ? '1' : '2',
        device_token: fcmToken,
        verification_type: selectedTab == 0 ? 'mobile' : 'email', //email | mobile
      };
      console.log('data1=-=-', JSON.stringify(data));
      setIsLoading(true);

      LoginUserRequest(data)
        .then(res => {
          console.log('res', res);

          if (res?.result?.email_verified) {
            Toast.success('Login', res?.message);
            Storage.store('userdata', res?.result).then(() => {
              setTimeout(() => {
                dispatch(userDataAction(res?.result));
                console.log('res?.result=-=-');

                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'HomeScreen'}],
                  }),
                );
              }, 500);
            });
          } else if (res?.result?.email_verified == false) {
            navigation.navigate('OTPScreen', {email: res?.result?.email});
          }
        })
        .catch(err => {
          console.log('err', JSON.stringify(err));
          Toast.error('Login', err?.message);
        })
        .finally(() => setIsLoading(false));
    // }
  };

  useEffect(() => {
    getFCMToken().then(res => {
      console.log('token', res);
      setFcmToken(res);
    });
  }, []);

  useEffect(() => {
    if (!isFocused) {
      clearInputs();
    }
  }, [isFocused]);
  return (
    <>
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{flex: 1}}>
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <ScrollView
      // contentContainerStyle={styles.inputSwitchViewStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
        <View>
        <BackHeader />
 
     <View style={{alignItems:'center'}}>
        <View style={{
           backgroundColor: colors.primaryColor ,
          paddingHorizontal:15,
          paddingVertical:10,
           borderRadius: 10,
          marginTop: 20,
          minWidth:150
        }}>
        <Text style={styles.titleTxtStyle}>Sign in with password</Text>
        </View>
        </View>

        <View style={styles.footerViewStyle}>
          <View style={styles.footerSubView}>
            <Text style={styles.footerTxtStyle}>Don’t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BirthScreen')}>
              <Text style={styles.signTxtStyle}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.switchBoxContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedTab(0);
              setState(prevState => ({...prevState, password: ''}));
            }}
            style={styles.mobileBoxStyle(selectedTab == 0)}>
            <Text style={styles.mobileTxtStyle(selectedTab == 0)}>
              Mobile Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedTab(1);
              setState(prevState => ({...prevState, password: ''}));
            }}
            style={styles.emailBoxStyle(selectedTab == 1)}>
            <Text style={styles.emailTxtStyle(selectedTab == 1)}>Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSwitchViewStyle}>
          {selectedTab == 0 ? (
            <MobileNoInput
              label="Mobile Number"
              callingCode={callingCode}
              value={state.mobileNo}
              onCountryChange={code => setCallingCode(code)}
              onTextChange={txt =>
                setState(prevState => ({...prevState, mobileNo: txt}))
              }
            />
          ) : (
            <CustomLabelInput
              label="Email Address"
              keyboardType="email-address"
              value={state.email}
              onTextChange={txt =>
                setState(prevState => ({...prevState, email: txt}))
              }
            />
          )}

          <CustomLabelInput
            label="Enter Password"
            isPassword={true}
            value={state.password}
            onTextChange={txt =>
              setState(prevState => ({...prevState, password: txt}))
            }
            containerStyle={{marginVertical: wp(25)}}
          />

          <TouchableOpacity
            style={{
              marginLeft: '55%',
            }}
            onPress={() => navigation.navigate('ForgetPasswordScreen')}>
            <Text style={styles.forgetPasswordTxtStyle}>Forgot Password?</Text>
          </TouchableOpacity>

          <View>
          <CustomCheckBox
        label="By continuing, you agree to our "
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        color={colors.primaryColor}
      />
           
          </View>

          <View style={styles.submitBtnStyle}>
            <CustomButton
              isLoading={isLoading}
              label="Continue"
              onPress={submitLogin}
              // disabled={!isChecked}
            />
          </View>
        </View>

        {/* <View style={styles.footerViewStyle}>
          <View style={styles.footerSubView}>
            <Text style={styles.footerTxtStyle}>Don’t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('BirthScreen')}>
              <Text style={styles.signTxtStyle}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        </View>
        </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    fontSize: wp(20),
    color: colors.black,
    textAlign: 'center',
    // textDecorationLine:'underline'
  },

  switchBoxContainer: {
    backgroundColor: colors.lightGray,
    margin: wp(24),
    paddingHorizontal: 5,
    paddingVertical: wp(7),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  mobileBoxStyle: isActive => {
    return {
      backgroundColor: isActive ? colors.primaryColor : colors.lightGray,
      paddingVertical: wp(15),
      paddingHorizontal: wp(10),
      borderRadius: 10,
      flex: 0.6,
      alignItems: 'center',
    };
  },

  mobileTxtStyle: isActive => {
    return {
      fontFamily: isActive ? fonts.semiBold : fonts.medium,
      fontSize: wp(13),
      color: colors.black,
    };
  },

  emailBoxStyle: isActive => {
    return {
      backgroundColor: isActive ? colors.primaryColor : colors.lightGray,
      paddingVertical: wp(15),
      paddingHorizontal: wp(10),
      borderRadius: 10,
      alignItems: 'center',
      flex: 0.4,
    };
  },

  emailTxtStyle: isActive => {
    return {
      fontFamily: isActive ? fonts.semiBold : fonts.medium,
      fontSize: wp(13),
      color: colors.black,
    };
  },

  inputSwitchViewStyle: {
    margin: wp(20),
  },

  forgetPasswordTxtStyle: {
    textAlign: 'right',
    fontFamily: fonts.medium,
    color: colors.black,
    marginHorizontal: 10,
    fontSize: wp(13),
  },

  submitBtnStyle: {
    marginTop: wp(45),
  },

  footerViewStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: wp(30),
  },

  footerSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerTxtStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(14),
    color: colors.black,
  },

  signTxtStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.primaryColor,
  },
});

export default LoginScreen;
