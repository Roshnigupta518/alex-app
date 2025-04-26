import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ImageConstants from '../../constants/ImageConstants';
import {colors, fonts, HEIGHT, wp} from '../../constants';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SocialLoginRequest} from '../../services/Utills';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import Toast from '../../constants/Toast';
import {useDispatch, useSelector} from 'react-redux';
import {userDataAction} from '../../redux/Slices/UserInfoSlice';
import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';
import {CommonActions} from '@react-navigation/native';
import Storage from './../../constants/Storage';
import {getFCMToken} from '../../constants/FCMGeneration';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../components/NoInternetModal';

import crashlytics from '@react-native-firebase/crashlytics';
const SocialLoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFor, setLoadingFor] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const userInfo = useSelector(state => state.UserInfoSlice.data);
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
  GoogleSignin.configure({
    webClientId:
      '859541725168-s116r4rg7fkcn9b6b43a93kcu0k16aoc.apps.googleusercontent.com',
  });

  const buttonList = [
    {
      type: 'email',
      icon: ImageConstants.person,
      title: 'Continue with Email/Mobile Number',
      action: () => navigation.navigate('LoginScreen'),
    },
    {
      type: 'fb',
      icon: ImageConstants.facebook,
      title: 'Continue with Facebook',
      action: () =>
        onFacebookButtonPress()
          .then(res => MakeFbUserLogin(res))
          .catch(() => {
            setIsLoading(false);
            setLoadingFor('');
          }),
    },
    {
      type: 'google',
      icon: ImageConstants.google,
      title: 'Continue with Google',
      action: () =>
        onGoogleButtonPress()
          .then(() => MakeUserLogin(true))
          .catch(() => {
            setIsLoading(false);
            setLoadingFor('');
          }),
    },
    {
      type: 'apple',
      icon: ImageConstants.apple,
      title: 'Continue with Apple',
      action: () =>
        onAppleButtonPress()
          .then(res => {
            MakeAppleLoginUser(res);
          })
          .catch(() => {
            setIsLoading(false);
            setLoadingFor('');
          }),
    },
  ];

  async function onAppleButtonPress() {
    setIsLoading(true);
    setLoadingFor('apple');
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      setIsLoading(false);
      setLoadingFor('');
      // Log the error with Crashlytics

      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }

  async function onGoogleButtonPress() {
    setIsLoading(true);
    setLoadingFor('google');
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  async function onFacebookButtonPress() {
    setIsLoading(true);
    setLoadingFor('fb');
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      setIsLoading(false);
      setIsLoading(false);
      setLoadingFor('');

      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const MakeAppleLoginUser = async res => {
    let data = {
      name: res?.user?.displayName == null ? '' : res?.user?.displayName,
      email: res?.additionalUserInfo?.profile?.email,
      type: 'apple',
      device_token: fcmToken || 'token_denied',
      access_token: res?.user?.uid,
      device_type: Platform.OS == 'android' ? '1' : '2',
    };

    SocialLoginRequest(data)
      .then(res => {
        Toast.success('Login', res?.message);
        let user = res?.result || {};

        const updatedUser = Object.assign({}, user, {
          type: 'apple',
        });

        Storage.store('userdata', updatedUser).then(() => {
          dispatch(userDataAction(updatedUser));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'HomeScreen'}],
            }),
          );

          setIsLoading(false);
          setLoadingFor('');
        });
      })
      .catch(err => {
        Toast.error('Login', err?.message);
        setIsLoading(false);
        setLoadingFor('');
      });
  };

  const MakeFbUserLogin = async ({additionalUserInfo}) => {
    let data = {
      name: additionalUserInfo?.profile?.name,
      email: additionalUserInfo?.profile?.email,
      type: 'facebook',
      device_token: fcmToken || 'token_denied',
      access_token: additionalUserInfo?.profile?.id,
      device_type: Platform.OS == 'android' ? '1' : '2',
    };

    SocialLoginRequest(data)
      .then(res => {
        Toast.success('Login', res?.message);
        let user = res?.result || {};

        const updatedUser = Object.assign({}, user, {
          type: 'facebook',
        });

        Storage.store('userdata', updatedUser).then(() => {
          dispatch(userDataAction(updatedUser));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'HomeScreen'}],
            }),
          );
        });
      })
      .catch(err => {
        Toast.error('Login', err?.message);
      });
  };

  const MakeUserLogin = async (isGoogle = true) => {
    let data = {};

    await GoogleSignin.getCurrentUser().then(({user}) => {
      Object.assign(data, {
        name: user?.givenName + ' ' + user?.familyName,
        email: user?.email,
        type: isGoogle ? 'google' : 'facebook',
        device_token: fcmToken || 'token_denied',
        access_token: user?.id,
        device_type: Platform.OS == 'android' ? '1' : '2',
      });

      console.log(data, '-----', user);
    });

    SocialLoginRequest(data)
      .then(res => {
        let user = res?.result || {};

        const updatedUser = Object.assign({}, user, {
          type: isGoogle ? 'google' : 'facebook',
        });
        Toast.success('Login', res?.message);
        Storage.store('userdata', updatedUser).then(() => {
          dispatch(userDataAction(updatedUser));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'HomeScreen'}],
            }),
          );
        });
      })
      .catch(err => {
        Toast.error('Login', err?.message);
      });
  };

  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(true);
    getFCMToken()
      .then(res => {
        console.log('token', res);
        setFcmToken(res);
      })
      .catch(err => {
        console.debug('Error', err);
      });

    const backAction = () => {
      Alert.alert(
        'Exit From Alex',
        'Are you sure you want to close this application?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    Settings.setAppID('742487000924268');
    Settings.initializeSDK();
  }, [userInfo]);

  return (
    <>
      <ImageBackground source={ImageConstants.loginbg} style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.titleStyle}>Create or Login Account</Text>

          <View>
            {buttonList?.map((item, index) => {
              if (Platform.OS == 'android') {
                if (item?.type != 'apple') {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={item.action}
                      style={{...styles.buttonStyle, position: 'relative'}}
                      key={index}>
                      {isLoading && item?.type == loadingFor && (
                        <View
                          style={{
                            width: '100%',
                            paddingVertical: 10,
                            position: 'absolute',
                            alignItems: 'center',
                            top: 0,
                            backgroundColor: '#fff',
                            opacity: 0.8,
                            zIndex: 9999,
                          }}>
                          <ActivityIndicator
                            size={'small'}
                            color={colors.primaryColor}
                          />
                        </View>
                      )}
                      <View style={styles.buttonSubView}>
                        <Image
                          source={item.icon}
                          style={styles.buttonIconStyle}
                        />
                        <Text style={styles.buttonTitle}>{item?.title}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              } else {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={item.action}
                    style={styles.buttonStyle}
                    key={index}>
                    {isLoading && item?.type == loadingFor && (
                      <View
                        style={{
                          width: '100%',
                          paddingVertical: 10,
                          position: 'absolute',
                          alignItems: 'center',
                          top: 5,
                          backgroundColor: '#fff',
                          opacity: 0.8,
                          zIndex: 9999,
                        }}>
                        <ActivityIndicator
                          size={'small'}
                          color={colors.primaryColor}
                        />
                      </View>
                    )}
                    <View style={styles.buttonSubView}>
                      <Image
                        source={item.icon}
                        style={styles.buttonIconStyle}
                      />
                      <Text style={styles.buttonTitle}>{item?.title}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      </ImageBackground>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: HEIGHT / 14,
    marginHorizontal: wp(24),
  },

  titleStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(17),
    color: colors.black,
    marginBottom: wp(20),
  },

  buttonStyle: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrayColor,
    padding: wp(12),
    borderRadius: 10,
    marginVertical: 5,
  },

  buttonSubView: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonIconStyle: {
    position: 'absolute',
    marginLeft: wp(12),
    height: 28,
    width: 28,
    flex: 1,
  },

  buttonTitle: {
    fontFamily: fonts.medium,
    fontSize: wp(16),
    color: colors.black,
    marginLeft: wp(52),
  },
});

export default SocialLoginScreen;
