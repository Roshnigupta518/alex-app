import React, {useEffect, useState} from 'react';

import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
} from 'react-native';
import {WIDTH, colors, fonts, wp} from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import ImageConstants from '../constants/ImageConstants';
import {ReelIndexAction} from '../redux/Slices/ReelIndexSlice';
import { ChatReadAction } from '../redux/Slices/ChatReadSlice';

const {width} = Dimensions.get('window');
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
}
const CustomBottomTab = ({state, descriptors, navigation}) => {
  const dispatch = useDispatch();
  const chatInfo = useSelector(state => state.ChatListSlice.data);
  const chatRead = useSelector(state => state.ChatReadSlice.data);
  const userInfo = useSelector(state => state.UserInfoSlice.data);

  const navigationUserScreens = [
    'Home',
    'ChatScreen',
    'PostMediaScreen',
    'ExploreScreen',
    'BusinessScreen',
    'ProfileScreen',
  ];
  const navigationBusinessScreen = [
    'Home',
    'BusinessUserListingScreen',
    'EventUserListingScreen',
    'ProfileScreen',
  ];

  const navigationUserObj = {
    Home: {name: 'Home', icon: ImageConstants.home, isDisable: false},
    ChatScreen: {name: 'Chat', icon: ImageConstants.chat, isDisable: false},
    PostMediaScreen: {
      name: 'Post',
      icon: ImageConstants.add_post,
      isDisable: false,
    },
    ExploreScreen: {
      name: 'Explore',
      icon: ImageConstants.explore,
      isDisable: false,
    },
    BusinessScreen: {
      name: 'Business',
      icon: ImageConstants.bag,
      isDisable: false,
    },
    EventUserListingScreen: {
      name: 'Events',
      icon: ImageConstants.calendar,
      isDisable: false,
    },
    BusinessUserListingScreen: {
      name: 'Business',
      icon: ImageConstants.bag,
      isDisable: false,
    },
    ProfileScreen: {
      name: 'Profile',
      icon: ImageConstants.profile,
      isDisable: false,
    },
  };
  const [Read, setRead] = useState(false);
  const [showingScreen, setShowingScreen] = useState(
    userInfo?.role == '1' ? navigationUserScreens : navigationBusinessScreen,
  );
  const [UserList, setUserList] = useState([]);
  useEffect(() => {
    setShowingScreen(
      userInfo?.role == '1' ? navigationUserScreens : navigationBusinessScreen,
    );
  }, [userInfo]);

  useEffect(() => {
    getAllUsers();
  }, [chatInfo]);

  const getAllUsers = (id = '') => {
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
         
          if (
            chat_detail?.reciever?._id === userInfo?.id && // the logged-in user is the receiver
            chat_detail?.isRead === false // message is unread
          ) {
            console.log('🚀 New unread message detected!');
            dispatch(ChatReadAction(true))
            setRead(true); // set dot to show
          }
          
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
      // console.log('self bottom tab', JSON.stringify(self_data));
      setUserList([...self_data]);
    }
  };
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        if (showingScreen?.includes(route?.name)) {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (route.name == 'Home') {
              dispatch(ReelIndexAction(0));
            }

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <View
              key={index}
              style={[
                styles.mainItemContainer,
                {borderRightWidth: label == 'notes' ? 3 : 0},
              ]}>
              <Pressable
                onPress={onPress}
                disabled={navigationUserObj[label]?.isDisable}
                style={{}}>
                <View>
                  <View style={styles.parentView}>
                    {chatRead && navigationUserObj[label]?.name == 'Chat' && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10 / 2,
                          backgroundColor: 'red',
                          position: 'absolute',
                          zIndex: 999,
                          right: -5,
                          top: 4,
                        }}></View>
                    )}
                    <View style={{borderRadius: 40}}>
                      <Image
                        source={navigationUserObj[label]?.icon}
                        style={{
                          tintColor: isFocused
                            ? colors.primaryColor
                            : colors.black,
                        }}
                      />
                    </View>
                    {/* <Text
                    style={styles.labelTxtStyle(
                      isFocused,
                      navigationUserObj[label]?.name?.length < 8,
                    )}>
                    {navigationUserObj[label]?.name}
                  </Text> */}
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: {height: 30, width: 1},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    paddingHorizontal: wp(10),
    paddingBottom: wp(23),
    paddingTop: wp(5),
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    borderColor: '#333B42',
  },

  parentView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(10),
  },

  labelTxtStyle: (active, isHistory) => {
    return {
      fontFamily: active ? fonts.bold : fonts.regular,
      fontSize: !isHistory ? wp(12) : wp(12),
      color: colors.white,
      marginTop: 5,
    };
  },

  activeBottomBarStyle: {
    height: 7,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderBottomEndRadius: 5,
    width: width / 7,
    backgroundColor: colors.white,
  },
});

export default CustomBottomTab;
