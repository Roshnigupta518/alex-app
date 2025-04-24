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
  ActivityIndicator,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {useSelector} from 'react-redux';
import {
  GetUserPostsRequest,
  GetUserProfileRequest,
  MakeFollowedUserRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import {Video, ResizeMode} from 'expo-av';
import verifyUserChatList from '../ChatScreen/ChatUtills/GetChatId';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const UserProfileDetail = ({navigation, route}) => {
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const chatInfo = useSelector(state => state.ChatListSlice.data);

  const [userDetails, setUserDetails] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(true);
  const [isFollow, setIsFollow] = useState(false);
  const [postData, setPostData] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable != undefined) {
        console.log('see state of Internet: ', state.isInternetReachable);
        setIsInternetConnected(state.isInternetReachable);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  const makeFollowUser = () => {
    setIsFollowLoading(true);
    MakeFollowedUserRequest({follow_user_id: route?.params?.userId})
      .then(res => {
        Toast.success('Request', res?.message);
        setIsFollow(!isFollow);
      })
      .catch(err => {
        Toast.error('Request', err?.message);
      })
      .finally(() => setIsFollowLoading(false));
  };

  const getUserProfile = () => {
    setIsFollowLoading(true);
    GetUserProfileRequest(route?.params?.userId || userInfo?.id)
      .then(res => {
        setUserDetails(res?.result);
        setIsFollow(res?.result?.isFollowed);
      })
      .catch(err => {
        Toast.error('Profile', err?.message);
      })
      .finally(() => setIsFollowLoading(false));
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
              style={styles.videoPostStyle}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getUserProfile();
    getUsersPosts();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <BackHeader />
        </View>

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
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={makeFollowUser}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.primaryColor,
                  padding: wp(10),
                  minWidth: WIDTH / 2.8,
                  alignItems: 'center',
                  borderRadius: 7,
                  marginRight: 5,
                }}>
                {isFollowLoading ? (
                  <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(17),
                      color: colors.white,
                    }}>
                    {isFollow ? 'Following' : 'Follow'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  verifyUserChatList(userInfo, userDetails, chatInfo)
                    .then(res => {
                      let chatId = Object.keys(res)[0];
                      let chat_users = Object.keys(res[chatId])[0];
                      navigation.navigate('MessageScreen', {
                        chatId,
                        chatObjKey: chat_users,
                        reciever: userDetails,
                        isSelfReadable: true,
                        isOppReadable: true,
                      });
                    })
                    .catch(err => Toast.error('Chat', 'Something went wrong'));
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.lightBlack,
                  padding: wp(10),
                  minWidth: WIDTH / 2.8,
                  alignItems: 'center',
                  borderRadius: 7,
                  marginLeft: 5,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: wp(17),
                    color: colors.white,
                  }}>
                  Message
                </Text>
              </TouchableOpacity>
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

            <View style={styles.contentView}>
              <Text style={styles.contentTextStyle}>
                {userDetails?.follower_count}
              </Text>
              <Text style={styles.contentTitleStyle}>Followers</Text>
            </View>
            <Image source={ImageConstants.verticalLine} />

            <View style={styles.contentView}>
              <Text style={styles.contentTextStyle}>
                {userDetails?.following_count}
              </Text>
              <Text style={styles.contentTitleStyle}>Following</Text>
            </View>
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
    color: colors.white,
    textAlign: 'center',
  },

  UserImageView: {
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
    color: colors.primaryColor,
    width: WIDTH / 2.1,
    textAlign: 'center',
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
    borderRadius: 5,
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

export default UserProfileDetail;
