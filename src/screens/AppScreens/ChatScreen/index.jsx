import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import SearchInput from '../../../components/SearchInput';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DeleteChatSheet from '../../../components/ActionSheetComponent/DeleteChatSheet';
import NotFoundAnime from '../../../components/NotFoundAnime';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';
const ChatScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const chatInfo = useSelector(state => state.ChatListSlice.data);
  const onlineUserInfo = useSelector(state => state.OnlineUserSlice.data);

  const swipeRef = useRef(null);
  const deleteChatRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [deletedUser, setDeletedUser] = useState([]);
  const [searchTxt, setSearchTxt] = useState('');
  const [userList, setUserList] = useState([]);
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
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

  const getOnlineUser = () => {
    let data = onlineUserInfo;
    if (data != null) {
      setOnlineUsers(Object.keys(data));
    } else {
      setOnlineUsers([]);
    }
  };

  useEffect(() => {
    getOnlineUser();
  }, [onlineUserInfo]);

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

  const getAllUsers = (id = '') => {
    setIsLoading(true);
    let data = {...JSON.parse(chatInfo)};
    //
    let self_data = [];
    if (data != null) {
      Object.keys(data)?.forEach(keyItem => {
        let chat_detail = Object.values(data[keyItem])[0];
        let reciever_user = {};
        let sender_user = {};
        if (
          chat_detail?.sender?._id != userInfo?.id &&
          chat_detail?.reciever?._id == userInfo?.id
        ) {
          reciever_user = {...chat_detail?.sender};
          sender_user = {...chat_detail?.reciever};
        } else if (
          chat_detail?.reciever?._id != userInfo?.id &&
          chat_detail?.sender?._id == userInfo?.id
        ) {
          reciever_user = {...chat_detail?.reciever};
          sender_user = {...chat_detail?.sender};
        }

        if (Object.keys(reciever_user)?.length > 0) {
          let chatObject = {
            msg_detail: {
              message: chat_detail?.last_msg,
              timestamp: chat_detail?.timestamp
                ? timeAgo(new Date(chat_detail?.timestamp))
                : '',
              isRead: chat_detail?.isRead,
              createdAt: chat_detail?.timestamp,
            },
            chat_info: {
              isSelfReadable: chat_detail[userInfo?.id],
              isOppReadable:
                chat_detail[
                  sender_user?._id == userInfo?.id
                    ? reciever_user?._id
                    : sender_user?._id
                ],
              chatId: keyItem,
              chatObjKey: Object.keys(data[keyItem])[0],
              reciever: reciever_user,
              sender: sender_user,
            },
          };

          if (
            chatObject?.chat_info?.chatId != id &&
            chatObject?.msg_detail?.message != '' &&
            chatObject?.msg_detail?.message != undefined
          ) {
            self_data?.push(chatObject);
          }
        }
      });

      self_data.sort((a, b) => {
        const timeA = new Date(a.msg_detail.createdAt);
        const timeB = new Date(b.msg_detail.createdAt);
        return timeB - timeA;
      });
      // console.log('self chat screen', JSON.stringify(self_data));
      setUserList([...self_data]);
      setSearchedUserList([...self_data]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      setSearchTxt('');
      getAllUsers();
    }
  }, [isFocused]);

  const searchUser = txt => {
    let searchUsers = userList?.filter(item =>
      item?.chat_info?.reciever?.anonymous_name?.includes(txt),
    );
    setSearchedUserList(txt?.length < 1 ? [...userList] : [...searchUsers]);
  };

  return (
    <>
      <CustomContainer>
        <View
          style={{
            padding: wp(20),
            flex: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(22),
              color: colors.black,
            }}>
            Chat
          </Text>

          <View
            style={{
              marginVertical: wp(20),
            }}>
            <SearchInput
              value={searchTxt}
              onChangeText={txt => {
                searchUser(txt);
                setSearchTxt(txt);
              }}
            />
          </View>

          <SwipeListView
            ref={swipeRef}
            data={searchedUserList}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            style={{
              padding: 10,
            }}
            // ListEmptyComponent={<EmptyListRender />}
            renderItem={({item}, rowMap) => {
              const isUnreadAndReceivedByMe =
  // item?.chat_info?.reciever?._id === userInfo?.id &&
  item?.msg_detail?.isRead === false;
           // Message is unread
            
              // console.log(
              //   'Receiver:', item?.chat_info?.reciever?._id,
              //   'User:', userInfo?.id,
              //   'Is Read:', item?.msg_detail?.isRead
              // );
              

              return (
                <>
                  {item?.chat_info?.isSelfReadable ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>
                        navigation.navigate('MessageScreen', item?.chat_info)
                      }
                      style={[
                        styles.userImageStyle,
                         { backgroundColor:isUnreadAndReceivedByMe? '#E6F7FF':'#fff' },
                      ]}
                      
                      >
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Image
                            source={
                              item?.chat_info?.reciever?.profile_picture
                                ? {
                                    uri: item?.chat_info?.reciever
                                      ?.profile_picture,
                                  }
                                : ImageConstants.user
                            }
                            style={styles.userImageView}
                          />

                          {onlineUsers?.includes(
                            item?.chat_info?.reciever?._id,
                          ) && (
                            <View
                              style={{
                                height: 14,
                                width: 14,
                                backgroundColor: colors.primaryColor,
                                borderRadius: 40,
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                              }}
                            />
                          )}
                        </View>

                        <View style={styles.userCotentContainer}>
                          <Text style={styles.usernameStyle}>
                            {item?.chat_info?.reciever?.anonymous_name}
                          </Text>
                          <Text
                            style={styles.userCommentStyle(
                              item?.chat_info?.sender?._id != userInfo?.id &&
                                !item?.msg_detail?.isRead,
                            )}>
                            {item?.msg_detail?.message}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.timeStyle}>
                        {item?.msg_detail?.timestamp}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </>
              );
            }}
            disableRightSwipe={true}
            renderHiddenItem={({item}, rowMap) => {
              return (
                <View style={styles.drawerStyle}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      deleteChatRef.current?.show(
                        item?.chat_info?.chatId,
                        item?.chat_info?.reciever?.anonymous_name,
                        item?.chat_info?.chatObjKey,
                      );
                    }}
                    style={styles.deleteIconView}>
                    <Image
                      source={ImageConstants.delete}
                      style={styles.iconStyle}
                    />
                    <Text style={styles.itemNameStyle}>Delete</Text>
                  </TouchableOpacity>
                  <View style={{width: 40}} />
                </View>
              );
            }}
            leftOpenValue={75}
            rightOpenValue={-130}
            keyExtractor={item => item?.chat_info?.reciever?._id}
          />
        </View>

        <DeleteChatSheet
          ref={deleteChatRef}
          onSuccess={id => {
            setTimeout(() => {
              getAllUsers(id);
            }, 700);
          }}
          // onCloseSheet={() => swipeRef?.current?.manuallyOpenAllRows(0)}
        />
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  userImageStyle: {
    // backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(10),
    // alignItems: 'center',
    minHeight: wp(87),
    marginVertical: 5,
    width: WIDTH / 1.17,
    shadowColor: colors.lightBlack,
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },

  userImageView: {
    height: wp(60),
    width: wp(60),
    borderRadius: 50,
  },

  userCotentContainer: {
    width: WIDTH / 2.5,
    marginHorizontal: 10,
  },

  usernameStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(16),
    color: colors.black,
  },

  userCommentStyle: isRead => {
    return {
      fontFamily: isRead ? fonts.semiBold : fonts.regular,
      fontSize: wp(12),
      color: colors.black,
    };
  },

  drawerStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height: wp(80),
    // width: WIDTH / 3,
    marginTop: 10,
  },

  deleteIconView: {
    height: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: colors.primaryColor,
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

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    width: WIDTH / 6,
    textAlign: 'right',
  },
});

export default ChatScreen;
