import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  FlatList, Dimensions, BackHandler
} from 'react-native';
import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {
  GetUserPostsRequest,
  GetUserProfileRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import TabsHeader from '../../../components/TabsHeader';
import { formatCount, openSocialLink, tabList } from '../../../validation/helper';
import MediaItem from '../../../components/GridView';
import NotFoundAnime from '../../../components/NotFoundAnime';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';
import { SocialLinks } from '../../../components/social';

const ProfileDetail = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [userDetails, setUserDetails] = useState(null);
  const [postData, setPostData] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
 
  const [activeTab, setActiveTab] = useState('photo');
  const [isLoading, setIsLoading] = useState(false)

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
  const getUserProfile = () => {
    // console.log('ser', userInfo);
    GetUserProfileRequest(route?.params?.userId || userInfo?.id)
      .then(res => {
        setUserDetails(res?.result);
      })
      .catch(err => {
        Toast.error('Profile', err?.message);
      });
  };

  const getUsersPosts = async () => {
    setIsLoading(true)
    GetUserPostsRequest(route?.params?.userId || userInfo?.id)
      .then(res => {
        setPostData(res?.result);
        setIsLoading(false)
      })
      .catch(err => {
        console.log('err', err);
        Toast.error('Post', err?.message);
        setIsLoading(false)
      });
  };

  const renderTabContent = () => {
    let filteredData = [];

    if (activeTab === 'photo') {
      filteredData = postData.filter(item => item?.postData?.post?.mimetype !== 'video/mp4');
    } else if (activeTab === 'video') {
      filteredData = postData.filter(item => item?.postData?.post?.mimetype === 'video/mp4');
    }

    if (filteredData.length === 0) {
      return (
        <NotFoundAnime isLoading={isLoading} />
      );
    }

    return (
      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <MediaItem
            item={item}
            onPress={() =>
              navigation.navigate('ReelViewer', {
                data: filteredData,
                currentIndex: index,
                onDeletePost: deletedId => {
                  setPostData(prev => prev.filter(item => item?.postData?._id !== deletedId));
                },
              })
            }
            index={index}
          />
        )}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 15 }}
      />
    );
  };


  useEffect(() => {
    if (isFocused) {
      getUserProfile();
    }
  }, [isFocused]);

  useEffect(() => {
    getUsersPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Navigate to the desired screen when the hardware back button is pressed
        navigation.navigate('HomeScreen') // replace 'AnotherScreen' with your target screen name
        return true; // returning true means you have handled the back press
      };

      // Add event listener
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Remove the listener when the screen is unfocused or unmounted
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation]) // dependencies: add anything else you’re using inside useCallback
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader label="Profile Details"
          onPress={() => navigation.navigate('HomeScreen')}
          rightView={() => <TouchableOpacity onPress={() => navigation.navigate('Setting')} >
            <Image source={ImageConstants.settings} style={styles.imgsty} />
          </TouchableOpacity>}
          profileEdit={true}
          onEdit={() => navigation.navigate('EditProfileScreen')}
        />
        <View
          style={{
            flex: 1,
          }}>
          <View style={styles.UserImageView}>
            <View style={styles.wdh30}>
              <Image
                source={
                  userDetails?.profile_picture
                    ? { uri: userDetails?.profile_picture }
                    : ImageConstants.user
                }
                style={styles.userImagesStyle}
              />
            </View>

            <View style={styles.wdh70}>
              <View style={styles.profileCounts}>
                <View style={styles.wdh33}>
                  <View>
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.post_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Posts</Text>
                  </View>

                </View>
                <View style={styles.wdh33}>
                  <TouchableOpacity onPress={() =>
                    navigation.navigate('FollowUsers', {
                      id: userInfo?.id,
                      type: 'followers',
                    })
                  }>
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.follower_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Followers</Text>
                  </TouchableOpacity>

                </View>
                <View style={styles.wdh33}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('FollowUsers', {
                        id: userInfo?.id,
                        type: 'following',
                      })
                    }>
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.following_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Following</Text>
                  </TouchableOpacity>

                </View>
              </View>

              <View style={[styles.profileCounts, { marginVertical: 10 }]}>
                {/* <View style={styles.wdh33}>
                  <View >
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.places_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Places</Text>
                  </View>
                </View> */}
                <View style={styles.wdh33}>

                  <TouchableOpacity onPress={() =>
                    navigation.navigate('UserPlaces', {
                      id: userInfo?.id,
                      type: 'Cities',
                    })
                  }>
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.cityes_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Cities</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.wdh33}>

                  <TouchableOpacity onPress={() =>
                    navigation.navigate('UserPlaces', {
                      id: userInfo?.id,
                      type: 'Countries',
                    })
                  }>
                    <Text style={styles.contentTextStyle}>{formatCount(userDetails?.countries_count)}</Text>
                    <Text style={styles.contentTitleStyle}>Countries</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.ml20}>
              <SocialLinks  data={userDetails}/>
              </View>
            </View>
          </View>


          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.contentTextStyle, { textAlign: 'left' }]}>{userDetails?.name}</Text>
            {(userDetails?.city || userDetails?.bio) &&
              <Text style={[styles.contentTitleStyle, { textAlign: 'left' }]}>{userDetails?.city}{'\n'}
                {userDetails?.bio}
              </Text>}
          </View>

          <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabList} />
          {renderTabContent()}

        </View>
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
  ml20:{
   marginLeft:40
  }, 
  iconsty:{
    overflow: 'visible', 
    marginHorizontal:wp(10)
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
    color: colors.black,
    textAlign: 'center',
  },

  UserImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(10),
    marginHorizontal: wp(20),
  },

  userImagesStyle: {
    height: wp(120),
    width: wp(120),
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
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 2,
  },

  contentTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(14),
    color: colors.black,
    textAlign: 'center'
  },

  contentTitleStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(12),
    color: colors.gray,
    textAlign: 'center'
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
  imgsty: { width: wp(20), height: wp(20) },
  profileCounts: {
    flexDirection: 'row',
    marginLeft: 15
  },
  wdh70: { width: '70%' },
  wdh33: { width: "33%" },
  wdh30: { width: "30%" }

});

export default ProfileDetail;
