import React, {forwardRef, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, WIDTH, wp} from '../../constants';
import CustomButton from '../CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import ImageConstants from '../../constants/ImageConstants';
import {SwitchUserRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {userDataAction} from '../../redux/Slices/UserInfoSlice';
import Storage from '../../constants/Storage';

const SwitchUserSheet = forwardRef(({onActionDone = () => {}}, ref) => {
  const reportItems = [
    {username: 'User Account', type: 1},
    {username: 'Business Account', type: 2},
  ];

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const actionSheetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    !isNaN(Number(userInfo?.role)) ? parseInt(userInfo?.role) - 1 : 0,
  );

  // Expose actionSheetRef to parent component through forwarded ref
  React.useImperativeHandle(ref, () => ({
    show: () => {
      setSelectedOption(
        !isNaN(Number(userInfo?.role)) ? parseInt(userInfo?.role) - 1 : 0,
      );
      actionSheetRef.current?.show();
    },
    hide: () => {
      actionSheetRef.current?.hide(false);
    },
  }));

  const userSwitch = () => {
    setIsLoading(true);

    SwitchUserRequest()
      .then(res => {
        Toast.success('Switch User', res?.message);
        if (Object.keys(res?.result)?.length > 0) {
          let data = {...res?.result};
          data['id'] = data['_id'];
          data['token'] = userInfo?.token;

          Storage.store('userdata', data).then(() => {
            dispatch(userDataAction(data));
          });
          actionSheetRef.current?.hide();
          onActionDone();
        }
      })
      .catch(err => {
        Toast.error('Switch User', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ActionSheet ref={actionSheetRef} containerStyle={styles.container}>
      <View style={styles.subView}>
        <View style={styles.drawerHandleStyle} />

        <View
          style={{
            marginTop: wp(20),
            marginBottom: wp(30),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(20),
              color: colors.primaryColor,
              textAlign: 'center',
            }}>
            Switch Your Account
          </Text>
        </View>

        <View style={styles.commentListContainer}>
          {reportItems?.map((item, index) => {
            return (
              <View
                style={{
                  marginHorizontal: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedOption(index);
                  }}
                  style={{
                    marginVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        userInfo?.profile_picture
                          ? {uri: userInfo?.profile_picture}
                          : ImageConstants.profile
                      }
                      style={{
                        height: wp(40),
                        width: wp(40),
                        borderRadius: 60,
                        marginRight: wp(10),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: wp(18),
                        color: colors.black,
                      }}>
                      {item?.username}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 4,
                      backgroundColor: colors.white,
                      borderRadius: 40,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption == index
                            ? colors.primaryColor
                            : colors.borderGrayColor,
                        height: wp(15),
                        width: wp(15),
                        borderRadius: 40,
                      }}
                    />
                  </View>
                </TouchableOpacity>

                {reportItems?.length - 1 != index && (
                  <View
                    style={{
                      height: 2,
                      backgroundColor: colors.gray,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>

        <View
          style={{
            marginBottom: wp(30),
          }}>
          <CustomButton
            label="Next"
            disabled={Number(userInfo?.role) - 1 == selectedOption}
            isLoading={isLoading}
            onPress={userSwitch}
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
    // height: HEIGHT / 2.2,
    paddingBottom: 20,
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
export default SwitchUserSheet;
