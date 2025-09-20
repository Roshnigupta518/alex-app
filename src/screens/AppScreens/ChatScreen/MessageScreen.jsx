import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector, useDispatch} from 'react-redux';
import database from '@react-native-firebase/database';
import Toast from '../../../constants/Toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import { ChatReadAction } from '../../../redux/Slices/ChatReadSlice';
import CustomContainer from '../../../components/container';

const MessageScreen = ({navigation, route}) => {
  const {chatId, chatObjKey, reciever, isSelfReadable, isOppReadable} =
    route?.params;
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
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

  const sendMessageToUser = async msg => {
    try {
      let self_user = {...userInfo};
      self_user['_id'] = self_user['id'];

      database()
        .ref(`/recent_chat/${chatId}`)
        .update({
          [chatObjKey]: {
            [userInfo?.id]: isSelfReadable,
            [reciever?._id]: isOppReadable,
            isRead: false,
            timestamp: msg?.createdAt,
            last_msg: msg?.text,
            sender: self_user,
            reciever,
          },
        });

      let storeChatPromise = database().ref(`/chats/${chatId}`).push(msg);
      storeChatPromise.catch(err => {
        console.log('err1', err);
        Toast.error('Chat', 'Message not sent, Something went wrong!');
      });
    } catch (err) {
      console.log('err2', err);
      Toast.error('Chat', 'Message not sent, Something went wrong!');
    }
  };

  // useEffect(() => {
  //   let readUpdateRef = database().ref(`/recent_chat/${chatId}/${chatObjKey}`);
  //   let reference = database().ref(`/chats/${chatId}`);
  //   try {
  //     reference.on('value', snapshot => {
  //       const data = snapshot.val();
  //       if (data != null) {
  //         const sortedArray = Object.values(data)
  //           .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  //           ?.reverse();
  //         setMessages([...sortedArray]);

  //         let reverseArr = sortedArray?.reverse();

  //         //make read message...
  //         if (reverseArr[reverseArr?.length - 1]?.user?._id != userInfo?.id) {
  //           readUpdateRef.update({
  //             isRead: true,
  //           });
  //         }
  //       }
  //     });
  //   } catch (err) {
  //     console.log('err', err);
  //     Toast.error('Chat', 'Something went wrong');
  //   }

  //   return () => {
  //     reference.off();
  //     readUpdateRef.off();
  //   };
  // }, []);

  
  useEffect(() => {
    // Update the isRead status immediately when the chat is opened
    const readUpdateRef = database().ref(`/recent_chat/${chatId}/${chatObjKey}`);
    readUpdateRef.update({
      isRead: true,
    }).then(() => {
      console.log('✅ Marked as read when opened the chat.');
      dispatch(ChatReadAction(false))
    }).catch(err => {
      console.log('❌ Error marking as read:', err);
    });
  
    // Listen for new messages
    const reference = database().ref(`/chats/${chatId}`);
    try {
      reference.on('value', snapshot => {
        const data = snapshot.val();
        if (data != null) {
          const sortedArray = Object.values(data)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            ?.reverse();
          setMessages([...sortedArray]);
        }
      });
    } catch (err) {
      console.log('err', err);
      Toast.error('Chat', 'Something went wrong');
    }
  
    return () => {
      reference.off();
      readUpdateRef.off();
    };
  }, []);  
  
  
  const onSend = useCallback((messages = []) => {
    let epochTime = new Date();
    let msg = {
      _id: messages[0]?._id,
      createdAt: epochTime?.toISOString(),
      text: messages[0]?.text,
      user: {
        _id: userInfo?.id,
        name: userInfo?.name,
        avatar: userInfo?.profile_picture,
      },
    };

    sendMessageToUser(msg);
  }, []);

  return (
    <>
      <CustomContainer>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp(15),
            marginTop: Platform.OS == 'android' ? wp(20) : 0,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={ImageConstants.leftArrow}
              style={{
                height: wp(20),
                width: wp(20),
                tintColor: colors.black,
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(20),
              color: colors.black,
            }}>
            {reciever?.anonymous_name}
          </Text>

          <TouchableOpacity>
            {/* <Image
            source={ImageConstants.h_menu}
            style={{
              tintColor: colors.black,
              resizeMode: 'contain',
              height: wp(20),
              width: wp(20),
              transform: [{rotate: '90deg'}],
            }}
          /> */}
          </TouchableOpacity>
        </View>

        {/* Chat VIew */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.extraLightPrimaryColor,
            padding: wp(20),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: 20,
          }}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: userInfo?.id,
            }}
          />
        </View>
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default MessageScreen;
