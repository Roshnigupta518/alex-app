import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {
  getAllFollowerRequest,
  getAllFollowingRequest,
  MakeFollowedUserRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import ImageConstants from '../../../constants/ImageConstants';
import NotFoundAnime from '../../../components/NotFoundAnime';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const FollowUsers = ({navigation, route}) => {
  const [searchTxt, setSearchTxt] = useState('');
  const [users, setUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
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
  const addFollowingUser = id => {
    MakeFollowedUserRequest({follow_user_id: id})
      .then(res => {
        Toast.success('Request', res?.message);
        callUserList();
      })
      .catch(err => {
        Toast.error('Request', err?.message);
      });
  };

  const getAllFollowing = () => {
    getAllFollowingRequest(route?.params?.id)
      .then(res => {
        setUsers(res?.result);
        setSearchedUser(res?.result);
      })
      .catch(err => Toast.error('Follow List', err?.message));
  };

  const getAllFollowers = () => {
    getAllFollowerRequest(route?.params?.id)
      .then(res => {
        setUsers(res?.result);
        setSearchedUser(res?.result);
      })
      .catch(err => Toast.error('Follow List', err?.message));
  };

  const callUserList = () => {
    if (route?.params?.type == 'following') {
      getAllFollowing();
    } else {
      getAllFollowers();
    }
  };

  useEffect(() => {
    callUserList();
  }, []);

  const searchUser = txt => {
    let user_res = searchedUser.filter(item => {
      if (
        route?.params?.type == 'following' &&
        item?.follow_user_id?.anonymous_name?.includes(txt)
      ) {
        return item;
      } else if (item?.user_id?.anonymous_name?.includes(txt)) {
        return item;
      }
    });

    setSearchedUser(txt?.length < 1 ? [...users] : [...user_res]);
  };

  const _renderUserList = useCallback(
    ({item, index}) => {
      if (item?.follow_user_id != null) {
        return (
          <TouchableOpacity 
          onPress={()=> {
            if(route?.params?.type == 'following')
            {
              navigation.navigate('UserProfileDetail', {
                userId: item?.follow_user_id?._id ,
              })
            }
            if(route?.params?.type != 'following'){
            navigation.navigate('UserProfileDetail', {
            userId: item?.user_id?._id ,
          }
        )
      }
      }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: colors.white,
              marginVertical: 5,
              borderRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: wp(60),
                  width: wp(4),
                  backgroundColor: colors.primaryColor,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 6,
                }}>
                {item?.follow_user_id?.profile_picture && (
                  <Image
                    source={{
                      uri: item?.follow_user_id?.profile_picture,
                    }}
                    style={{
                      height: wp(50),
                      width: wp(50),
                      borderRadius: 90,
                      marginHorizontal: 10,
                    }}
                  />
                )}
                {item?.user_id?.profile_picture && (
                  <Image
                    source={{
                      uri: item?.user_id?.profile_picture,
                    }}
                    style={{
                      height: wp(50),
                      width: wp(50),
                      borderRadius: 90,
                      marginHorizontal: 10,
                    }}
                  />
                )}

                {!item?.user_id?.profile_picture &&
                  !item?.follow_user_id?.profile_picture && (
                    <Image
                      source={ImageConstants.user}
                      style={{
                        height: wp(50),
                        width: wp(50),
                        borderRadius: 90,
                        marginHorizontal: 10,
                      }}
                    />
                  )}
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: wp(16),
                    color: colors.black,
                    width: WIDTH / 2.2,
                  }}>
                  {item?.follow_user_id?.anonymous_name ||
                    item?.user_id?.anonymous_name}
                </Text>
              </View>
            </View>

            {item?.isFollowed == false ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    addFollowingUser(
                      item?.user_id?._id || item?.follow_user_id?._id,
                    )
                  }
                  style={{
                    backgroundColor: colors.primaryColor,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(12),
                      color: colors.white,
                    }}>
                    Follow
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  addFollowingUser(
                    item?.user_id?._id || item?.follow_user_id?._id,
                  )
                }
                style={{
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: wp(12),
                    color: colors.primaryColor,
                  }}>
                  Following
                </Text>
              </TouchableOpacity>
            )}
          </View>
          </TouchableOpacity>
        );
      }
    },
    [users],
  );

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <BackHeader
          label={route?.params?.type == 'following' ? 'Following' : 'Followers'}
        />

        <View
          style={{
            padding: wp(15),
            flex: 1,
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              searchUser(txt);
              setSearchTxt(txt);
            }}
          />

          <View
            style={{
              marginTop: wp(20),
              flex: 1,
            }}>
            <FlatList
              data={searchedUser}
              ListEmptyComponent={<NotFoundAnime />}
              renderItem={_renderUserList}
              keyExtractor={item => item._id}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default FollowUsers;
