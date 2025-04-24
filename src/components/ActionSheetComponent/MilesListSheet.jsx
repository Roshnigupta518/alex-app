import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';

const MilesListSheet = forwardRef(({onMileSelect = () => {}}, ref) => {
  const miles_list = [
    {label: '5 miles', value: '5'},
    {label: '10 miles', value: '10'},
    {label: '25 miles', value: '25'},
    {label: '50 miles', value: '50'},
    {label: '100 miles', value: '100'},
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
          {miles_list?.map((item, index) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    onMileSelect(item?.value);
                    actionSheetRef.current?.hide();
                  }}
                  style={{
                    marginVertical: 12,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: wp(20),
                      color: colors.primaryColor,
                    }}>
                    {item?.label}
                  </Text>
                </TouchableOpacity>
                {index != miles_list?.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.primaryColor,
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
});

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
    textAlign: 'center',
  },

  commentListContainer: {
    // height: HEIGHT / 4,
    marginTop: wp(20),
    marginBottom: wp(50),
    backgroundColor: colors.lightBlack,
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
export default MilesListSheet;
