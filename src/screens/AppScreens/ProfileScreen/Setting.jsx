import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import Storage from '../../../constants/Storage';
import {userDataAction} from '../../../redux/Slices/UserInfoSlice';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ImageConstants from '../../../constants/ImageConstants';
import CustomButton from '../../../components/CustomButton';
import database from '@react-native-firebase/database';
import DeleteAccountSheet from '../../../components/ActionSheetComponent/DeleteAccountSheet';
import SignOutSheet from '../../../components/ActionSheetComponent/SignOutSheet';
import SwitchUserSheet from '../../../components/ActionSheetComponent/SwitchUserSheet';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import BackHeader from '../../../components/BackHeader';
import CustomContainer from '../../../components/container';

const ProfileScreen = ({navigation}) => {
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

  const profile_menu_list = [
    // {
    //   icon: ImageConstants.profileicon,
    //   name: 'Profile Detail',
    //   screen: () => navigation.navigate('ProfileDetail'),
    //   shouldShowActionIcon: true,
    // },
    {
      icon: ImageConstants.save,
      name: 'Saved Post',
      screen: () => navigation.navigate('SavedPostScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.savedpost,
      name: 'Favorites',
      screen: () => navigation.navigate('FavouriteScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.security,
      name: 'Change Password',
      screen: () => navigation.navigate('ChangePasswordScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.remove,
      name: 'Delete Account',
      screen: () => deleteAccountRef.current?.show(),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.block,
      name: 'Blocked Users',
      screen: () => navigation.navigate('BlockListScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.help,
      name: 'Help',
      screen: () => navigation.navigate('HelpScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.info,
      name: 'About Us',
      screen: () => navigation.navigate('AboutUsScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.policy,
      name: 'Privacy Policy',
      screen: () => navigation.navigate('PrivacyPolicyScreen'),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
    {
      icon: ImageConstants.switch,
      name: 'Switch Account',
      screen: () => switchUserRef.current?.show(),
      shouldShowActionIcon: true,
      shouldDisable: false,
    },
  ];

  const dispatch = useDispatch();
  const deleteAccountRef = useRef();
  const signOutRef = useRef();
  const switchUserRef = useRef();
  const userInfo = useSelector(state => state.UserInfoSlice.data);

  const LogoutUser = async () => {
    const userAgeRef = database().ref('/online-users');
    console.log('userInfo', JSON.stringify(userInfo));
    if (userInfo != undefined || userInfo != null) {
      if (userInfo?.type == 'facebook') {
        LoginManager.logOut();
        await auth().signOut();
      }
      if (userInfo?.type == 'google') {
        await GoogleSignin.signOut();
        await auth().signOut();
      }
    }
    userAgeRef.child(userInfo?.id).remove();

    Storage.clearAll().then(() => {
      dispatch(userDataAction(null));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SocialLoginScreen'}],
        }),
      );
    });
  };

  const _renderProfileItemList = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item?.shouldDisable}
        onPress={item?.screen}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: wp(10),
          marginVertical: wp(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={item?.icon}
            style={{
              height: wp(32),
              width: wp(32),
              resizeMode: 'contain',
              tintColor: colors.black,
            }}
          />

          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(18),
              color: colors.black,
              marginHorizontal: wp(10),
            }}>
            {item?.name}
          </Text>
        </View>

        <TouchableOpacity>
          <Image
            source={ImageConstants.rightArrow}
            style={{
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <CustomContainer>
          <BackHeader label='Settings' />

        <View
          style={{
            marginHorizontal: wp(10),
            marginTop: wp(20),
          }}>
          <FlatList
            data={profile_menu_list}
            renderItem={_renderProfileItemList}
            style={{height: HEIGHT / 1.53}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={{marginTop: 20}}>
          <CustomButton
            label="Sign Out"
            onPress={() => signOutRef.current?.show()}
          />
        </View>

        <DeleteAccountSheet ref={deleteAccountRef} onSuccess={LogoutUser} />
        <SignOutSheet ref={signOutRef} onSuccess={LogoutUser} />
        <SwitchUserSheet
          ref={switchUserRef}
          onActionDone={() => navigation.navigate('HomeScreen')}
        />
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default ProfileScreen;
