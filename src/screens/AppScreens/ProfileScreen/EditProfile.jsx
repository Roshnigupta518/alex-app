import React, { useEffect, useRef, useState } from 'react';
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
  ScrollView, Dimensions
} from 'react-native';
import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import { useDispatch, useSelector } from 'react-redux';
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
import { userDataAction } from '../../../redux/Slices/UserInfoSlice';
import Storage from '../../../constants/Storage';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import TabsHeader from '../../../components/TabsHeader';
import NotFoundAnime from '../../../components/NotFoundAnime';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const EditProfileScreen = ({ navigation, route }) => {
  const mediaRef = useRef(null);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [userImage, setUserImage] = useState(userInfo?.profile_picture || '');

  const [state, setState] = useState({
    screenName: userInfo?.anonymous_name || '',
    userName: userInfo?.name || '',
    email: userInfo?.email || '',
    instagram: '',
    twitter: '',
    tiktok: '',
    facebook: '',
    youtube: '',
    state: '',
    city: '',
    zip: '',
    telephone: '',
    address: '',
    bio: '',
  });
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'account', title: 'Account Info' },
    { key: 'social', title: 'Social Media' },
  ]);

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
    let instaErr = checkValidation('instagram', state.instagram)
    let youtubeErr = checkValidation('youtube', state.youtube)
    let tiktokErr = checkValidation('tiktok', state.tiktok)
    let twitterErr = checkValidation('twitter', state.twitter)
    let facebookErr = checkValidation('facebook', state.facebook)

    let nameErr = state.userName;

    if (anonymsErr?.length > 0) {
      Toast.error('Edit Profile', anonymsErr);
      return false;
    } else if (state.screenName.startsWith(' ')) {
      Toast.error('Edit Profile', 'Please enter valid screen name');
      return false;
    } else if (nameErr.trim() === '') {
      Toast.error('Edit Profile', 'Please enter user name');
      return false;
    } else if (nameErr.startsWith(' ')) {
      Toast.error('Edit Profile', 'Please enter valid user name');
      return false;
    }

    // ✅ Social Links Validation (only if entered)
    const { instagram, twitter, facebook, tiktok, youtube } = state;

    if (instagram && instaErr) {
      Toast.error('Edit Profile', instaErr);
      return false;
    }
    if (twitter && twitterErr) {
      Toast.error('Edit Profile', twitterErr);
      return false;
    }
    if (youtube && youtubeErr) {
      Toast.error('Edit Profile', youtubeErr);
      return false;
    }

    if (facebook && facebookErr) {
      Toast.error('Edit Profile', facebookErr);
      return false;
    }

    if (tiktok && tiktokErr) {
      Toast.error('Edit Profile', tiktokErr);
      return false;
    }

    return true;
  };
  // console.log({userInfo})
  const getUserInfo = () => {
    setIsLoading(true)
    GetMyProfileRequest()
      .then(res => {
        let data = { ...res?.result };
        Object.assign(data, {
          id: userInfo?.id,
          token: userInfo?.token,
        });
        console.log({ data })
        setState({
          ...state,
          instagram: data?.socialLinks?.instagram,
          twitter: data?.socialLinks?.twitter,
          tiktok: data?.socialLinks?.tiktok,
          facebook: data?.socialLinks?.facebook,
          youtube: data?.socialLinks?.youtube,
          state: data?.state,
          city: data?.city,
          zip: data?.zip,
          telephone: data?.phone,
          address: data?.address,
          bio: data?.bio,
        })
        Storage.store('userdata', data)
          .then(() => {
            dispatch(userDataAction(data));
          })
          .catch(err => Toast.error('Storage', err?.message));
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
      data.append('instagram', state.instagram);
      data.append('twitter', state.twitter);
      data.append('tiktok', state.tiktok);
      data.append('facebook', state.facebook);
      data.append('youtube', state.youtube);

      data.append('address', state.address);
      data.append('city', state.city);
      data.append('zip', state.zip);
      data.append('state', state.state);
      data.append('bio', state.bio);
      data.append('phone', state.telephone);
      setIsLoading(true);
      updateProfileRequest(data)
        .then(res => {
          Toast.success('Profile', res?.message);
          getUserInfo();
          navigation.goBack();
        })
        .catch(err => {
          Toast.error('Profiles', err?.message);
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  };

  // const renderTabContent = () => {
  //   switch (activeTab) {
  //     case 'account':
  //       return (
  //         <View>
  //           <View style={{ margin: wp(20) }}>
  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Enter Email Id"
  //               placeholder="Input Text"
  //               editable={false}
  //               value={state.email}
  //               maxLength={255}
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Screen Name"
  //               placeholder="Input Text"
  //               value={state.screenName}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, screenName: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="User Name"
  //               placeholder="Input Text"
  //               value={state.userName}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, userName: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             {/* <CustomLabelInput
  //               placeholderColor="white"
  //               label="Password"
  //               placeholder=""
  //               value={state.password}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, password: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             /> */}

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Address"
  //               placeholder=""
  //               value={state.address}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, address: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="City"
  //               placeholder=""
  //               value={state.city}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, city: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="State"
  //               placeholder=""
  //               value={state.state}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, state: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Zip"
  //               placeholder=""
  //               value={state.zip}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, zip: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Telephone"
  //               placeholder=""
  //               value={state.telephone}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, telephone: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //               keyboardType='numeric'
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="About yourself"
  //               placeholder=""
  //               value={state.bio}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, bio: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //           </View>
  //           <View style={{ marginVertical: wp(20) }}>
  //             <CustomButton
  //               label="Save Changes"
  //               onPress={submitProfile}
  //               isLoading={isLoading}
  //             />
  //           </View>
  //         </View>
  //       );
  //     case 'social':
  //       return (
  //         <View>
  //           <View style={{ margin: wp(20) }}>

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Tiktok"
  //               placeholder="Enter profile link"
  //               value={state.tiktok}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, tiktok: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Instagram"
  //               placeholder="Enter profile link"
  //               value={state.instagram}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, instagram: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Youtube"
  //               placeholder="Enter profile link"
  //               value={state.youtube}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, youtube: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="Facebook"
  //               placeholder="Enter profile link"
  //               value={state.facebook}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, facebook: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //             <CustomLabelInput
  //               placeholderColor="white"
  //               label="X"
  //               placeholder="Enter profile link"
  //               value={state.twitter}
  //               onTextChange={txt =>
  //                 setState(prevState => ({ ...prevState, twitter: txt }))
  //               }
  //               containerStyle={{ marginVertical: wp(10) }}
  //             />

  //           </View>
  //           <View style={{ marginVertical: wp(20) }}>
  //             <CustomButton
  //               label="Save Changes"
  //               onPress={submitProfile}
  //               isLoading={isLoading}
  //             />
  //           </View>
  //         </View>
  //       );
  //     case 'payment':
  //       return <Text>Payment Method Section (you can implement this later)</Text>;
  //   }
  // };



  const AccountTab = () => {
    return (
      <ScrollView style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{ margin: wp(20) }}>
            <CustomLabelInput
              placeholderColor="white"
              label="Enter Email Id"
              placeholder="Input Text"
              editable={false}
              value={state.email}
              maxLength={255}
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Screen Name"
              placeholder="Input Text"
              value={state.screenName}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, screenName: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="User Name"
              placeholder="Input Text"
              value={state.userName}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, userName: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            {/* <CustomLabelInput
                placeholderColor="white"
                label="Password"
                placeholder=""
                value={state.password}
                onTextChange={txt =>
                  setState(prevState => ({ ...prevState, password: txt }))
                }
                containerStyle={{ marginVertical: wp(10) }}
              /> */}

            <CustomLabelInput
              placeholderColor="white"
              label="Address"
              placeholder=""
              value={state.address}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, address: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="City"
              placeholder=""
              value={state.city}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, city: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="State"
              placeholder=""
              value={state.state}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, state: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Zip"
              placeholder=""
              value={state.zip}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, zip: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Telephone"
              placeholder=""
              value={state.telephone}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, telephone: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
              keyboardType='numeric'
            />

            <CustomLabelInput
              placeholderColor="white"
              label="About yourself"
              placeholder=""
              value={state.bio}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, bio: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

          </View>
          <View style={{ marginVertical: wp(20) }}>
            <CustomButton
              label="Save Changes"
              onPress={submitProfile}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    )
  };

  const SocialTab = () => {
    return (
      <ScrollView style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{ margin: wp(20) }}>

            <CustomLabelInput
              placeholderColor="white"
              label="Tiktok"
              placeholder="Enter profile link"
              value={state.tiktok}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, tiktok: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Instagram"
              placeholder="Enter profile link"
              value={state.instagram}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, instagram: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Youtube"
              placeholder="Enter profile link"
              value={state.youtube}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, youtube: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="Facebook"
              placeholder="Enter profile link"
              value={state.facebook}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, facebook: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

            <CustomLabelInput
              placeholderColor="white"
              label="X"
              placeholder="Enter profile link"
              value={state.twitter}
              onTextChange={txt =>
                setState(prevState => ({ ...prevState, twitter: txt }))
              }
              containerStyle={{ marginVertical: wp(10) }}
            />

          </View>
          <View style={{ marginVertical: wp(20) }}>
            <CustomButton
              label="Save Changes"
              onPress={submitProfile}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    )
  };


  const renderScene = SceneMap({
    account: AccountTab,
    social: SocialTab,
  });

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader label='Edit Profile' labelStyle={{ textAlign: 'center' }} />
        {!isLoading ? (

          <View style={{ flex: 1 }}>
            <View style={styles.UserImageView}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => mediaRef.current?.open()}>
                <Image
                  source={userImage ? { uri: userImage } : ImageConstants.user}
                  style={styles.userImagesStyle}
                />
              </TouchableOpacity>

              <View style={{ margin: 20 }}>
                <Text numberOfLines={2} style={styles.userNameStyle}>
                  {userInfo?.name}
                </Text>
              </View>
            </View>

            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: WIDTH }}
              renderTabBar={() => (
                <TabsHeader
                  activeTab={routes[index].key}
                  setActiveTab={(key) => {
                    const tabIndex = routes.findIndex(route => route.key === key);
                    if (tabIndex !== -1) setIndex(tabIndex);
                  }}
                  tabs={routes}
                />
              )}
            />
          </View>

        ) :
          <NotFoundAnime isLoading={isLoading} />
        }

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
    // marginTop: wp(40),
    marginHorizontal: wp(20),
  },

  userImagesStyle: {
    height: wp(100),
    width: wp(100),
    borderRadius: 100,
  },

  userNameStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(14),
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
