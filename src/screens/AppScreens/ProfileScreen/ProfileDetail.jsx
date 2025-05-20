import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  FlatList,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {
  GetUserPostsRequest,
  GetUserProfileRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const ProfileDetail = ({navigation, route}) => {
  const isFocused = useIsFocused();

  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [userDetails, setUserDetails] = useState(null);
  const [postData, setPostData] = useState([]);
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
    GetUserPostsRequest(route?.params?.userId || userInfo?.id)
      .then(res => {
        setPostData(res?.result);
      })
      .catch(err => {
        console.log('err', err);
        Toast.error('Post', err?.message);
      });
  };

  const RenderUserPost = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ReelViewer', {
            data: postData,
            currentIndex: index,
          })
        }>
        {item?.postData?.post?.mimetype != 'video/mp4' ? (
          <Image
            source={{uri: item?.postData?.post?.data}}
            style={styles.userPostImage}
          />
        ) : (
          <View style={styles.videoContainer}>
            <View style={styles.playIconStyle}>
              <Image
                source={ImageConstants.play}
                style={{
                  height: wp(60),
                  width: wp(60),
                  alignSelf: 'center',
                }}
              />
            </View>
            <Image
              source={{uri: item?.postData?.post_thumbnail}}
              style={{
                height: 200,
                width: WIDTH / 2.2,
                borderRadius: 10,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader label="Profile Details" />
        <View
          style={{
            flex: 1,
          }}>
          <View style={styles.UserImageView}>
            <Image
              source={
                userDetails?.profile_picture
                  ? {uri: userDetails?.profile_picture}
                  : ImageConstants.user
              }
              style={styles.userImagesStyle}
            />

            <View style={{margin: 20}}>
              <Text numberOfLines={2} style={styles.userNameStyle}>
                {userDetails?.anonymous_name}
              </Text>

              {(route?.params?.userId == userInfo?.id ||
                route?.params?.userId == undefined) && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfileScreen')}
                  activeOpacity={0.8}
                  style={styles.editProfileStyle}>
                  <Text style={styles.editProfileTxt}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.numberContentContainer}>
            <View style={styles.contentView}>
              <Text style={styles.contentTextStyle}>
                {userDetails?.post_count}
              </Text>
              <Text style={styles.contentTitleStyle}>Posts</Text>
            </View>
            <Image source={ImageConstants.verticalLine} />

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowUsers', {
                  id: userInfo?.id,
                  type: 'followers',
                })
              }
              style={styles.contentView}>
              <Text style={styles.contentTextStyle}>
                {userDetails?.follower_count}
              </Text>
              <Text style={styles.contentTitleStyle}>Followers</Text>
            </TouchableOpacity>
            <Image source={ImageConstants.verticalLine} />

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowUsers', {
                  id: userInfo?.id,
                  type: 'following',
                })
              }
              style={styles.contentView}>
              <Text style={styles.contentTextStyle}>
                {userDetails?.following_count}
              </Text>
              <Text style={styles.contentTitleStyle}>Following</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listViewStyle}>
            <FlatList
              data={postData}
              renderItem={RenderUserPost}
              numColumns={2}
            />
          </View>
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
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 2,
  },

  contentTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(20),
    color: colors.black,
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

export default ProfileDetail;
