import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {useDispatch, useSelector} from 'react-redux';
import CustomLabelInput from '../../../components/CustomLabelInput';
import {
  GetMyProfileRequest,
  GetUserProfileRequest,
  updateProfileRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import CustomButton from '../../../components/CustomButton';
import checkValidation from '../../../validation';
import MediaPickerSheet from './../../../components/MediaPickerSheet';
import {userDataAction} from '../../../redux/Slices/UserInfoSlice';
import Storage from '../../../constants/Storage';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const EditProfileScreen = ({navigation, route}) => {
  const mediaRef = useRef(null);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [userImage, setUserImage] = useState(userInfo?.profile_picture || '');
  const [state, setState] = useState({
    screenName: userInfo?.anonymous_name || '',
    userName: userInfo?.name,
    email: userInfo?.email,
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
    let anonymsErr = checkValidation('anonymous_name', state.screenName);
    let nameErr = state.userName;
    if (anonymsErr?.length > 0) {
      Toast.error('Edit Profile', anonymsErr);
      return false;
    } else if (state.screenName.startsWith(' ')) {
      Toast.error('Edit Profile', 'Please enter vaild screen name');
      return false;
    } else if (nameErr.trim() == '') {
      Toast.error('Edit Profile', 'Please enter user name');
      return false;
    } else if (nameErr.startsWith(' ')) {
      Toast.error('Edit Profile', 'Please enter vaild user name');
      return false;
    } else {
      return true;
    }
  };

  const getUserInfo = () => {
    GetMyProfileRequest()
      .then(res => {
        let data = {...res?.result};
        Object.assign(data, {
          id: userInfo?.id,
          token: userInfo?.token,
        });

        Storage.store('userdata', data)
          .then(() => {
            dispatch(userDataAction(data));
          })
          .catch(err => Toast.error('Storage', err?.message));
        navigation.goBack();
      })
      .catch(err => {
        Toast.error('Profile fetching', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const submitProfile = () => {
    if (!validateFields()) {
      return;
    } else {
      let data = new FormData();
      if (imageData != null) {
        data.append('profile_picture', imageData);
      }
      data.append('anonymous_name', state.screenName);
      data.append('name', state.userName);

      setIsLoading(true);
      updateProfileRequest(data)
        .then(res => {
          Toast.success('Profile', res?.message);
          getUserInfo();
        })
        .catch(err => {
          Toast.error('Profiles', err?.message);
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <BackHeader />
        </View>
        <Text style={styles.titleStyle}>Profile Details</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'android' ? 'height' : 'padding'}
          showsVerticalScrollIndicator={false}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
              }}>
              <View style={styles.UserImageView}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => mediaRef.current?.open()}>
                  <Image
                    source={userImage ? {uri: userImage} : ImageConstants.user}
                    style={styles.userImagesStyle}
                  />
                </TouchableOpacity>

                <View style={{margin: 20}}>
                  <Text numberOfLines={2} style={styles.userNameStyle}>
                    {userInfo?.name}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  margin: wp(20),
                }}>
                <CustomLabelInput
                  placeholderColor="white"
                  label="Enter Email Id"
                  placeholder="Input Text"
                  editable={false}
                  value={state.email}
                  maxLength={255}
                  containerStyle={{marginVertical: wp(10)}}
                  renderRightView={() => {
                    return (
                      <View>
                        <Image
                          source={ImageConstants.mail}
                          style={{
                            height: wp(25),
                            width: wp(25),
                            resizeMode: 'contain',
                            marginHorizontal: 10,
                            tintColor: colors.black,
                          }}
                        />
                      </View>
                    );
                  }}
                />

                <CustomLabelInput
                  placeholderColor="white"
                  label="Enter Screen Name"
                  placeholder="Input Text"
                  value={state.screenName}
                  onTextChange={txt =>
                    setState(prevState => ({...prevState, screenName: txt}))
                  }
                  containerStyle={{marginVertical: wp(10)}}
                  renderRightView={() => {
                    return (
                      <View>
                        <Image
                          source={ImageConstants.person}
                          style={{
                            height: wp(25),
                            width: wp(25),
                            resizeMode: 'contain',
                            marginHorizontal: 10,
                            tintColor: colors.black,
                          }}
                        />
                      </View>
                    );
                  }}
                />

                <CustomLabelInput
                  placeholderColor="white"
                  label="Enter User Name"
                  placeholder="Input Text"
                  value={state.userName}
                  onTextChange={txt =>
                    setState(prevState => ({...prevState, userName: txt}))
                  }
                  containerStyle={{marginVertical: wp(10)}}
                  renderRightView={() => {
                    return (
                      <View>
                        <Image
                          source={ImageConstants.person}
                          style={{
                            height: wp(25),
                            width: wp(25),
                            resizeMode: 'contain',
                            marginHorizontal: 10,
                            tintColor: colors.black,
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </View>

              <CustomButton
                label="Save Changes"
                onPress={submitProfile}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <MediaPickerSheet
          ref={mediaRef}
          onCameraClick={res => {
            setUserImage(res?.uri);
            setImageData(res);
          }}
          onMediaClick={res => {
            setUserImage(res?.uri);
            setImageData(res);
          }}
        />
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  getChildrenStyle: {
    width: (WIDTH - 18) / 2,
    height: Number(Math.random() * 20 + 12) * 10,
    backgroundColor: 'green',
    margin: 4,
    borderRadius: 18,
  },
  masonryHeader: {
    position: 'absolute',
    zIndex: 10,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.4)',
  },
  userPic: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    color: '#fafafa',
    fontWeight: 'bold',
  },

  userPostImage: {
    height: 140,
    width: WIDTH / 2.1,
    margin: 4,
  },

  videoPostStyle: {
    height: 200,
    width: WIDTH / 2.2,
    borderRadius: 10,
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  headerView: {
    position: 'absolute',
    marginTop: Platform.OS == 'ios' ? wp(50) : wp(20),
    zIndex: 2,
  },

  titleStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(22),
    color: colors.white,
    textAlign: 'center',
  },

  UserImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(40),
    marginHorizontal: wp(20),
  },

  userImagesStyle: {
    height: wp(100),
    width: wp(100),
    borderRadius: 100,
  },

  userNameStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(20),
    color: colors.black,
    width: WIDTH / 2.1,
  },

  editProfileStyle: {
    backgroundColor: colors.primaryColor,
    padding: wp(10),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  editProfileTxt: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.black,
  },

  numberContentContainer: {
    backgroundColor: colors.lightBlack,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  contentTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(20),
    color: colors.white,
  },

  contentTitleStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(17),
    color: colors.gray,
  },

  contentView: {
    alignItems: 'center',
  },

  listViewStyle: {
    flex: 1,
    marginTop: 10,
  },

  videoContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 10,
    margin: 4,
  },
  playIconStyle: {
    position: 'absolute',
    top: 75,
    width: WIDTH / 2.1,
    zIndex: 2,
  },
});

export default EditProfileScreen;
