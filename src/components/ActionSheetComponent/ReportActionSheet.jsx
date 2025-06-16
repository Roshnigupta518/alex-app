import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';

const ReportActionSheet = forwardRef(
  ({postId = '', userId = '', loggedInUserId='', onActionClick = (type = '') => {}}, ref) => {
    const reportItems = 
    userId === loggedInUserId
    ? [
      {
        label: 'Delete Post',
        action: () => onActionClick(userId, postId, 'delete_post'),
      }]:[
      {
        label: 'Report Post',
        action: () => onActionClick(userId, postId, 'report_post'),
      },
      {
        label: 'Report User',
        action: () => onActionClick(userId, postId, 'report_user'),
      },
      {
        label: 'Block User',
        action: () => onActionClick(userId, postId, 'block_user'),
      },
    ];

    const actionSheetRef = useRef(null);

    // Expose actionSheetRef to parent component through forwarded ref
    React.useImperativeHandle(ref, () => ({
      show: () => {
        actionSheetRef.current?.show();
      },
      hide: () => {
        actionSheetRef.current?.hide(false);
      },
    }));

    return (
      <ActionSheet ref={actionSheetRef} containerStyle={styles.container}>
        <View style={styles.subView}>
          <View style={styles.drawerHandleStyle} />

          <View style={styles.commentListContainer}>
            {reportItems?.map((item, index) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      item?.action();
                      actionSheetRef.current?.hide();
                    }}
                    style={{
                      marginVertical: 12,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize: wp(20),
                        color: colors.black,
                      }}>
                      {item?.label}
                    </Text>
                  </TouchableOpacity>
                  {index != reportItems?.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.lightBlack,
                        width: WIDTH,
                      }}
                    />
                  )}
                </View>
              );
            })}
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
    // height: HEIGHT / 4,
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
});
export default ReportActionSheet;
