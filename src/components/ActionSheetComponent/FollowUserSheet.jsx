import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import CustomButton from '../CustomButton';
import {MakeFollowedBusinessRequest, MakeFollowedUserRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const FollowUserSheet = forwardRef(
  (
    {
      userDetail = null,
      isFollowing = false,
      onFollowed = () => {},
      onUnfollowed = () => {},

      businessDetail = null,
      isBusinessFollowing = false,
      onBusinessFollowed = () => {},
      onBusinessUnfollowed = () => {},
    },
    ref,
  ) => {
    console.log({businessDetail})
    const actionSheetRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();
    // Expose actionSheetRef to parent component through forwarded ref
    React.useImperativeHandle(ref, () => ({
      show: () => {
        actionSheetRef.current?.show();
      },
      hide: () => {
        actionSheetRef.current?.hide(false);
      },
    }));

    const handleFollow = () => {
      setIsLoading(true);

      if (userDetail) {
        MakeFollowedUserRequest({ follow_user_id: userDetail?._id })
          .then(res => {
            Toast.success('Request', res?.message);
            isFollowing ? onUnfollowed() : onFollowed();
            actionSheetRef.current?.hide();
          })
          .catch(err => {
            Toast.error('Request', err?.message);
          })
          .finally(() => setIsLoading(false));
      } else if (businessDetail) {
        MakeFollowedBusinessRequest({ business_id: businessDetail?.place_id })
          .then(res => {
            Toast.success('Request', res?.message);
            isBusinessFollowing ? onBusinessUnfollowed() : onBusinessFollowed();
            actionSheetRef.current?.hide();
          })
          .catch(err => {
            Toast.error('Request', err?.message);
          })
          .finally(() => setIsLoading(false));
      }
    };
    const profileImage =
    userDetail
      ? userDetail?.profile_picture
        ? { uri: userDetail.profile_picture }
        : ImageConstants.user
      : businessDetail?.profile_picture
        ? { uri: businessDetail.profile_picture }
        : ImageConstants.business_logo;
    const displayName = userDetail?.anonymous_name || businessDetail?.name;
    const isFollowed = userDetail ? isFollowing : isBusinessFollowing;
    const followText = userDetail
      ? isFollowed
        ? 'Unfollow now'
        : 'Send Request To Follow'
      : isFollowed
      ? 'Unfollow Business'
      : 'Follow Business';

    return (
      // <ActionSheet ref={actionSheetRef} containerStyle={styles.container}>
      //   <View style={styles.subView}>
      //     <View style={styles.drawerHandleStyle} />

      //     <View style={styles.commentListContainer}>
      //       <Text
      //         style={{
      //           fontFamily: fonts.medium,
      //           fontSize: wp(25),
      //           color: colors.primaryColor,
      //           textAlign: 'center',
      //         }}>
      //         {isFollowing ? 'Unfollow now' : 'Send Request To Follow'}
      //       </Text>

      //       <Text
      //         style={{
      //           fontFamily: fonts.semiBold,
      //           fontSize: wp(18),
      //           color: colors.white,
      //           marginVertical: 16,
      //           textAlign: 'center',
      //         }}>
      //         {userDetail?.anonymous_name}
      //       </Text>
      //     </View>
      //     <Image
      //       source={
      //         userDetail?.profile_picture
      //           ? {
      //               uri: userDetail?.profile_picture,
      //             }
      //           : ImageConstants.user
      //       }
      //       style={styles.imageStyle}
      //     />

      //     <View
      //       style={{
      //         marginVertical: wp(20),
      //       }}>
      //       <CustomButton
      //         label={isFollowing ? 'Unfollow' : 'Follow'}
      //         isLoading={isLoading}
      //         onPress={onFollowAction}
      //       />
      //     </View>
      //   </View>
      // </ActionSheet>

      <ActionSheet ref={actionSheetRef} containerStyle={[styles.container,{ paddingBottom: insets.bottom }]}>
        <View style={styles.subView}>
          <View style={styles.drawerHandleStyle} />

          <Text 
                   style={{
                fontFamily: fonts.medium,
                fontSize: wp(25),
                color: colors.primaryColor,
                textAlign: 'center',
              }}
          >{followText}</Text>

          <Text 
                   style={{
                fontFamily: fonts.semiBold,
                fontSize: wp(18),
                color: colors.white,
                marginVertical: 16,
                textAlign: 'center',
              }}
          >{displayName}</Text>

        <Image
          source={profileImage}
          style={styles.imageStyle}
        />

          <View style={styles.buttonWrap}>
            <CustomButton
              label={isFollowed ? 'Unfollow' : 'Follow'}
              isLoading={isLoading}
              onPress={handleFollow}
            />
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
    // height: HEIGHT / 2.7,
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
export default FollowUserSheet;
