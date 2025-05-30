import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {colors, fonts, WIDTH, wp} from '../../constants';
import BackHeader from '../../components/BackHeader';
import MobileNoInput from '../../components/MobileNoInput';
import CustomLabelInput from '../../components/CustomLabelInput';
import CustomButton from '../../components/CustomButton';
import ImageConstants from '../../constants/ImageConstants';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import MediaPickerSheet from '../../components/MediaPickerSheet';
import SetupProfileValidation from './AuthValidation/SetupProfileValidation';
import {CreateUserProfileRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {getFCMToken} from '../../constants/FCMGeneration';

const SetupProfileScreen = ({navigation, route}) => {
  const mediaRef = useRef();

  const [fcmToken, setFcmToken] = useState('');
  const [callingCode, setCallingCode] = useState('');
  const [isMobileSelected, setMobileSelected] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    screenName: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    getFCMToken().then(res => {
      console.log('token', res);
      setFcmToken(res);
    });
  }, []);

  const submitProfile = () => {
    if (
      !SetupProfileValidation(
        userImage,
        state.screenName,
        state.name,
        state.password,
        state.confirmPassword,
        isMobileSelected,
        callingCode,
        state.phone,
        state.email,
      )
    ) {
      return;
    } else {
      let data = new FormData();
      data.append('anonymous_name', state.screenName.trim().replace(/\s+/g, ' '));
      data.append('name', state.name);
      data.append('password', state.password);
      data.append('confirm_password', state.confirmPassword);
      data.append('role', 1);
      data.append('dob', route?.params?.dob);
      data.append('device_token', fcmToken);
      data.append('email', state.email?.toLowerCase());
      console.log('see,', data);
      if (isMobileSelected) {
        data.append('phone', '+' + callingCode?.replace('+', '') + state.phone);
      }
      if (userImage != null) {
        data.append('profile_picture', userImage);
      }

      route?.params?.selectedCategories?.forEach((item, index) => {
        data.append(`intrested_category[${index}]`, item);
      });
      console.log('data=-=-', JSON.stringify(data));
      setIsLoading(true);
      CreateUserProfileRequest(data)
        .then(res => {
          Toast.success('Setup Profile', res?.message);
          navigation.navigate('OTPScreen', {email: res?.result?.email});
        })
        .catch(err => {
          console.log('errdata: ', JSON.stringify(err));
          Toast.error('Setup Profile', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader />

      <Text style={styles.titleTxtStyle}>Setup Profile</Text>

      <Text style={styles.subTitleStyle}>
        Add profile photo and name to blend in your vibe!
      </Text>

      <KeyboardAvoidingScrollView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => mediaRef.current?.open()}
          style={styles.imagePickerContainer}>
          <View style={styles.appIconStyle}>
            <Image
              source={
                userImage == null
                  ? ImageConstants.appIcon
                  : {uri: userImage?.uri}
              }
              style={styles.userImageStyle}
            />

            <View style={styles.plusViewStyle}>
              <Image source={ImageConstants.plus} style={styles.plusImgStyle} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.inputSwitchViewStyle}>
          <CustomLabelInput
            label="Screen Name"
            value={state.screenName}
            onTextChange={txt =>
              setState(prevState => ({...prevState, screenName: txt}))
            }
            containerStyle={{marginVertical: wp(25)}}
          />

          <CustomLabelInput
            label="User Name"
            value={state.name}
            onTextChange={txt =>
              setState(prevState => ({...prevState, name: txt}))
            }
          />

          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              style={styles.checkBoxViewStyle}
              activeOpacity={0.9}
              onPress={() => setMobileSelected(true)}>
              <View style={styles.checkBoxOutStyle}>
                <View
                  style={styles.checkboxInsideStyle(isMobileSelected == true)}
                />
              </View>
              <Text style={styles.checkBoxTxtStyle}>Mobile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkBoxViewStyle}
              activeOpacity={0.9}
              onPress={() => setMobileSelected(false)}>
              <View style={styles.checkBoxOutStyle}>
                <View
                  style={styles.checkboxInsideStyle(isMobileSelected == false)}
                />
              </View>
              <Text style={styles.checkBoxTxtStyle}>Email</Text>
            </TouchableOpacity>
          </View>

          {isMobileSelected && (
            <View style={styles.phoneNoContainer}>
              <MobileNoInput
                callingCode={callingCode}
                label="Phone Number"
                value={state.phone}
                onCountryChange={code => setCallingCode(code)}
                onTextChange={txt =>
                  setState(prevState => ({...prevState, phone: txt}))
                }
              />
            </View>
          )}

          <CustomLabelInput
            label="Email Address"
            value={state.email}
            keyboardType="email-address"
            onTextChange={txt =>
              setState(prevState => ({...prevState, email: txt}))
            }
          />

          <CustomLabelInput
            label="Create Password"
            isPassword={true}
            value={state.password}
            onTextChange={txt =>
              setState(prevState => ({...prevState, password: txt}))
            }
            containerStyle={{marginVertical: wp(25)}}
          />

          <CustomLabelInput
            label="Confirm Password"
            isPassword={true}
            value={state.confirmPassword}
            onTextChange={txt =>
              setState(prevState => ({...prevState, confirmPassword: txt}))
            }
          />

          <View style={styles.submitBtnStyle}>
            <CustomButton
              label="Continue"
              onPress={submitProfile}
              isLoading={isLoading}
              // onPress={() => navigation.navigate('OTPScreen')}
            />
          </View>
        </View>
      </KeyboardAvoidingScrollView>

      <MediaPickerSheet
        ref={mediaRef}
        onCameraClick={res => setUserImage(res)}
        onMediaClick={res => setUserImage(res)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  imagePickerContainer: {
    marginVertical: wp(30),
    alignItems: 'center',
  },

  appIconStyle: {
    padding: wp(30),
    backgroundColor: colors.lightGray,
    borderRadius: 100,
  },

  plusViewStyle: {
    padding: 7,
    borderRadius: 30,
    backgroundColor: colors.primaryColor,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },

  phoneNoContainer: {
    marginBottom: wp(20),
  },

  plusImgStyle: {
    height: wp(15),
    width: wp(15),
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
    fontSize: wp(14),
    color: colors.gray,
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: wp(40),
  },

  inputSwitchViewStyle: {
    margin: wp(20),
  },

  rightHeaderStyle: {
    paddingHorizontal: wp(20),
  },

  skipTxtStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(15),
  },

  submitBtnStyle: {
    marginTop: wp(45),
  },

  userImageStyle: {
    height: wp(60),
    width: wp(60),
    borderRadius: 100,
  },

  checkBoxContainer: {
    width: WIDTH / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp(20),
  },

  checkBoxViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkBoxOutStyle: {
    padding: 3,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.borderGrayColor,
  },

  checkboxInsideStyle: isActive => {
    return {
      height: wp(15),
      width: wp(15),
      borderRadius: 30,
      backgroundColor: isActive ? colors.primaryColor : colors.white,
    };
  },

  checkBoxTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.black,
    marginLeft: wp(10),
  },
});

export default SetupProfileScreen;
