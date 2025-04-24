import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import CustomButton from '../CustomButton';
import Toast from '../../constants/Toast';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';

const DeleteChatSheet = forwardRef(
  ({onSuccess = () => {}, onCloseSheet = () => {}}, ref) => {
    const actionSheetRef = useRef(null);
    const userInfo = useSelector(state => state.UserInfoSlice.data);

    const [chatId, setChatId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatObjKey, setChatObjKey] = useState('');
    // Expose actionSheetRef to parent component through forwarded ref
    React.useImperativeHandle(ref, () => ({
      show: (id, name, chatObjKey) => {
        setChatId(id);
        setUsername(name);
        setChatObjKey(chatObjKey);
        actionSheetRef.current?.show();
      },
      hide: () => {
        actionSheetRef.current?.hide(false);
      },
    }));

    const onDeleteChat = async () => {
      setIsLoading(true);
      try {
        // await database().ref(`/recent_chat/${chatId}`).remove();
        // await database().ref(`/chats/${chatId}`).remove();
        let DBRef = await database().ref(
          `/recent_chat/${chatId}/${chatObjKey}`,
        );
        DBRef.update({
          [userInfo?.id]: false,
        })
          .then(() => {
            actionSheetRef.current?.hide();
            Toast.success('Delete Chat', 'Chat deleted successfully');
          })
          .catch(err => {
            Toast.error('Delete Chat', 'Something went wrong!');
          });
      } catch (err) {
        Toast.error('Delete Chat', 'Something went wrong');
      }
    };
    return (
      <ActionSheet
        ref={actionSheetRef}
        onClose={onCloseSheet}
        containerStyle={styles.container}>
        <View style={styles.subView}>
          <View style={styles.drawerHandleStyle} />

          <View style={styles.commentCountView}>
            {/* <Text style={styles.commentCountTxt}>Comments</Text> */}
          </View>

          <View style={styles.commentListContainer}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: wp(18),
                color: colors.black,
                textAlign: 'center',
              }}>
              Are you sure to delete chat with
            </Text>

            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: wp(18),
                color: colors.primaryColor,
                marginVertical: 16,
                textAlign: 'center',
              }}>
              {username}?
            </Text>
          </View>

          <Image source={ImageConstants.trash} style={styles.imageStyle} />

          <View
            style={{
              marginVertical: wp(20),
            }}>
            <CustomButton
              label="Yes"
              isLoading={isLoading}
              onPress={() => {
                onDeleteChat().then(() => {
                  setIsLoading(false);
                  onSuccess(chatId);
                  actionSheetRef.current?.hide();
                });
              }}
            />

            <TouchableOpacity
              onPress={() => actionSheetRef.current?.hide(false)}
              style={{
                marginTop: wp(40),
                alignItems: 'center',
                marginBottom: wp(15),
              }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: wp(18),
                  color: colors.black,
                }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },
  subView: {
    backgroundColor: colors.white,
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
    textAlign: 'center',
  },

  commentListContainer: {
    // height: HEIGHT / 2.7,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },

  userImageStyle: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(10),
    // alignItems: 'center',
    minHeight: wp(87),
    marginVertical: 5,
    width: WIDTH,
  },

  userImageView: {
    height: wp(60),
    width: wp(60),
    borderRadius: 50,
  },

  userCotentContainer: {
    width: WIDTH / 1.8,
    marginHorizontal: 10,
  },

  usernameStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(16),
    color: colors.primaryColor,
  },

  userCommentStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(14),
    color: colors.white,
  },

  drawerStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height: wp(80),
    // width: WIDTH / 3,
    marginTop: 10,
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

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    width: WIDTH / 6,
    textAlign: 'right',
  },

  imageStyle: {
    height: wp(60),
    width: wp(60),
    alignSelf: 'center',
    marginVertical: wp(30),
    tintColor: colors.lightBlack,
  },
});
export default DeleteChatSheet;
