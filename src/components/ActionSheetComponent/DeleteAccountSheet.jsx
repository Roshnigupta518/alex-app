import React, {forwardRef, useRef, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, WIDTH, wp} from '../../constants';
import CustomButton from '../CustomButton';
import {DeleteAccountRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';

const DeleteAccountSheet = forwardRef(({onSuccess = () => {}}, ref) => {
  const actionSheetRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  // Expose actionSheetRef to parent component through forwarded ref
  React.useImperativeHandle(ref, () => ({
    show: () => {
      actionSheetRef.current?.show();
    },
    hide: () => {
      actionSheetRef.current?.hide(false);
    },
  }));

  const deleteAccount = () => {
    setIsLoading(true);

    DeleteAccountRequest()
      .then(res => {
        Toast.success('Delete Account', res?.message);
        actionSheetRef.current?.hide();
        onSuccess();
      })
      .catch(err => {
        Toast.error('Delete Account', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ActionSheet ref={actionSheetRef} containerStyle={styles.container}>
      <View style={styles.subView}>
        <View style={styles.drawerHandleStyle} />

        <View style={styles.commentCountView}>
          {/* <Text style={styles.commentCountTxt}>Comments</Text> */}
        </View>

        <View style={styles.commentListContainer}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(20),
              color: colors.black,
              marginVertical: 16,
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            Are you sure to delete your account?
          </Text>
        </View>

        <View
          style={{
            marginTop: wp(30),
            marginBottom: wp(50),
          }}>
          <CustomButton
            label={'Delete'}
            isLoading={isLoading}
            onPress={deleteAccount}
          />
        </View>
      </View>
    </ActionSheet>
  );
});

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
    backgroundColor: colors.lightBlack,
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
    height: wp(70),
    width: wp(70),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.secondPrimaryColor,
    alignSelf: 'center',
    marginVertical: wp(30),
  },
});
export default DeleteAccountSheet;
