import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {blockUserRequest, getBlockListRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';
import ImageConstants from '../../../constants/ImageConstants';
import UnblockUserSheet from '../../../components/ActionSheetComponent/UnblockUserSheet';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const BlockListScreen = ({navigation, route}) => {
  const unblockRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [users, setUsers] = useState([]);
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

  const getBlockedUsers = () => {
    setIsLoading(true);
    getBlockListRequest()
      .then(res => {
        console.log('seee user: ', res);
        setUsers(res?.result || []);
        setSearchedUsers(res?.result || []);
      })
      .catch(err => {
        Toast.error('Blocked Users', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const unBlockUser = id => {
    let data = {
      comment: 'Unblock',
      report_user_id: id,
    };

    blockUserRequest(data)
      .then(res => {
        Toast.success('User', res?.message);
        getBlockedUsers();
      })
      .catch(err => Toast.error('User', err?.message));
  };

  useEffect(() => {
    getBlockedUsers();
  }, []);

  const searchUserFilter = txt => {
    let searchUser = users?.filter(item =>
      item?.report_user_id?.anonymous_name?.includes(txt),
    );
    setSearchedUsers(txt?.length < 1 ? [...users] : [...searchUser]);
  };

  const _renderUserList = useCallback(
    ({item, index}) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.white,
            marginVertical: 5,
            borderRadius: 8,
            shadowColor: colors.black,
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 2,
            margin: 10,
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
              <Image
                source={
                  item?.report_user_id?.profile_picture
                    ? {
                        uri: item?.report_user_id?.profile_picture,
                      }
                    : ImageConstants.user
                }
                style={{
                  height: wp(50),
                  width: wp(50),
                  borderRadius: 90,
                  marginHorizontal: 10,
                }}
              />
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: wp(16),
                  color: colors.black,
                }}>
                {item?.report_user_id?.anonymous_name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => unblockRef.current?.show(item?.report_user_id?._id)}
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
              Unblock
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [users],
  );

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label={'Blocked Users'} />

        <View
          style={{
            padding: wp(15),
            flex: 1,
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              setSearchTxt(txt);
              searchUserFilter(txt);
            }}
          />
          <View
            style={{
              marginTop: wp(20),
              flex: 1,
            }}>
            <FlatList
              data={searchedUsers}
              renderItem={_renderUserList}
              ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
              keyExtractor={item => item._id}
            />
          </View>
        </View>
        <UnblockUserSheet
          ref={unblockRef}
          onUnBlock={() => getBlockedUsers()}
        />
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default BlockListScreen;
