import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {
  DeleteNotifcationRequest,
  GetAllNotificationRequest,
  ReadNotificationRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import DeleteNotificationSheet from '../../../components/ActionSheetComponent/DeleteNotifcationSheet';
import NotFoundAnime from '../../../components/NotFoundAnime';
import {current} from '@reduxjs/toolkit';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const NotificationScreen = ({navigation}) => {
  const notificationRef = useRef();
  const swipeRef = useRef(null);
  const [searchTxt, setSearchTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allNotification, setAllNotification] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
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
  const getAllNotification = () => {
    setIsLoading(true);
    GetAllNotificationRequest()
      .then(res => {
        if (res.result.length > 0) {
          const currentTime = new Date();
          let datafile = sortAndReverseItemsByTimestamp(res.result);
          setAllNotification([...datafile]);
          setNotificationList([...datafile] || []);
        } else {
          setAllNotification([]);
          setNotificationList([]);
        }
      })
      .catch(err => {
        Toast.error('Notification', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const sortAndReverseItemsByTimestamp = items => {
    // Convert `created_at` timestamps to Date objects for easier comparison
    const itemsWithDates = items.map(item => ({
      ...item,
      created_at_date: new Date(item.created_at),
    }));

    // Sort the items by `created_at` in ascending order
    const sortedItems = itemsWithDates.sort(
      (a, b) => a.created_at_date - b.created_at_date,
    );

    // Reverse the sorted items to have the most recent timestamps last
    const reversedItems = sortedItems.reverse();

    // Optionally, remove the `created_at_date` property before returning
    return reversedItems.map(({created_at_date, ...rest}) => rest);
  };

  const MakeReadNotification = id => {
    ReadNotificationRequest(id)
      .then(res => {
        Toast.success('Notification', res?.message);
        getAllNotification();
      })
      .catch(err => {
        Toast.error('Read Notification', err?.message);
      });
  };
  const onSearch = keyword => {
    let searchResult = allNotification?.filter(item =>
      item?.message?.toLowerCase()?.includes(keyword?.toLowerCase()),
    );
    setNotificationList(
      keyword?.length == 0 ? [...allNotification] : [...searchResult],
    );
  };

  function timeAgo(timestamp) {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);

    const intervals = {
      year: Math.floor(seconds / 31536000),
      month: Math.floor(seconds / 2592000),
      day: Math.floor(seconds / 86400),
      hour: Math.floor(seconds / 3600),
      minute: Math.floor(seconds / 60),
    };

    for (const [unit, interval] of Object.entries(intervals)) {
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }

    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  }

  useEffect(() => {
    getAllNotification();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Notifications" />

        <View
          style={{
            margin: 20,
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              onSearch(txt);
              setSearchTxt(txt);
            }}
          />
        </View>
        <View
          style={{
            margin: wp(14),
            flex: 1,
          }}>
          <SwipeListView
            ref={swipeRef}
            showsVerticalScrollIndicator={false}
            data={notificationList}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            renderItem={({item}, rowMap) => {
              console.log('item?.created_at', item?.created_at);
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    if (!item?.isRead) {
                      MakeReadNotification(item?._id);
                    }
                  }}
                  style={styles.userImageStyle(item?.isRead)}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.primaryColor,
                        width: 7,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 10,
                      }}>
                      <Image
                        source={
                          item?.sender_id?.profile_picture
                            ? {
                                uri: item?.sender_id?.profile_picture,
                              }
                            : ImageConstants.user
                        }
                        style={styles.userImageView}
                      />

                      <View style={styles.userCotentContainer}>
                        <Text style={styles.usernameStyle}>
                          {/* {item?.sender_id?.name}{' '} */}
                          <Text
                            style={{
                              fontFamily: fonts.regular,
                              fontSize: wp(13),
                            }}>
                            {item?.message}
                          </Text>
                        </Text>
                        <Text style={styles.timeStyle}>
                          {timeAgo(new Date(item?.created_at))}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            disableRightSwipe={true}
            renderHiddenItem={({item}, rowMap) => {
              return (
                <View style={styles.drawerStyle}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      notificationRef.current.show(item?._id, rowMap, item?._id)
                    }
                    style={styles.deleteIconView}>
                    <Image
                      source={ImageConstants.delete}
                      style={styles.iconStyle}
                    />
                    <Text style={styles.itemNameStyle}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            leftOpenValue={75}
            rightOpenValue={-100}
            keyExtractor={item => item?._id}
          />
        </View>
        <DeleteNotificationSheet
          ref={notificationRef}
          onDelete={(rowMap, rowKey) => {
            if (rowMap[rowKey]) {
              rowMap[rowKey]?.closeRow();
            }
            getAllNotification();
          }}
        />
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },
  subView: {
    backgroundColor: colors.lightBlack,
    paddingTop: wp(20),
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },

  drawerHandleStyle: {
    height: wp(7),
    width: wp(60),
    backgroundColor: colors.white,
    borderRadius: 40,
    alignSelf: 'center',
  },

  commentCountView: {
    marginTop: wp(10),
    margin: wp(20),
  },

  commentCountTxt: {
    fontFamily: fonts.semiBold,
    fontSize: wp(17),
    color: colors.white,
  },

  commentListContainer: isKeyboardVisible => {
    return {
      height: isKeyboardVisible ? HEIGHT / 3.3 : HEIGHT / 2.7,
      backgroundColor: colors.black,
    };
  },

  userImageStyle: (isRead = false) => {
    return {
      backgroundColor: isRead ? colors.white : colors.lightGray,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 10,
      minHeight: wp(87),
      marginVertical: 5,
      shadowColor: colors.backgroundLightBlackColor,
      shadowOffset: {width: 1, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 2,
    };
  },

  userImageView: {
    height: wp(50),
    width: wp(50),
    borderRadius: 50,
    resizeMode: 'stretch',
  },

  userCotentContainer: {
    marginHorizontal: 10,
    width: WIDTH / 1.6,
  },

  usernameStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(14),
    color: colors.black,
  },

  drawerStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height: wp(80),
    // width: WIDTH / 3,
    marginTop: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.primaryColor,
  },

  deleteIconView: {
    height: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  iconStyle: {
    height: wp(20),
    width: wp(20),
  },

  itemNameStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(13),
    color: colors.white,
    marginTop: 10,
  },

  lineSaparatorStyle: {
    backgroundColor: colors.white,
    width: 2,
  },

  commentInputView: {
    padding: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.black,
  },

  inputStyleView: {
    backgroundColor: colors.white,
    width: WIDTH / 1.27,
    borderRadius: 30,
  },

  sendButtonStyle: {
    height: wp(45),
    width: wp(45),
    backgroundColor: colors.secondPrimaryColor,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  spaceBoxView: {
    height: HEIGHT / 2.8,
    backgroundColor: colors.black,
  },

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    marginTop: 10,
  },
});
export default NotificationScreen;
