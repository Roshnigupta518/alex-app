import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import CustomButton from '../CustomButton';
import {
  blockUserRequest,
  reportPostRequest,
  reportUserRequest,
} from '../../services/Utills';
import Toast from '../../constants/Toast';

const ReportTypeOptionSheet = forwardRef(({onActionDone = () => {}}, ref) => {
  const reportItems = [
    {label: 'Nudity'},
    {label: 'Spam'},
    {label: 'Harassment'},
    {label: 'False information'},
    {label: 'Something else'},
  ];

  const actionSheetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  // Expose actionSheetRef to parent component through forwarded ref
  React.useImperativeHandle(ref, () => ({
    show: (userId, postId, type) => {
      setSelectedUser(userId);
      setSelectedPost(postId);
      setSelectedReportType(type);
      setTimeout(() => {
        actionSheetRef.current?.show();
      }, 1000);
    },
    hide: () => {
      actionSheetRef.current?.hide(false);
    },
  }));

  const ReportPost = async () => {
    setIsLoading(true);
    let data = {
      comment: reportItems[selectedOption]?.label,
      post_id: selectedPost,
    };
    await reportPostRequest(data)
      .then(res => {
        Toast.success('Report Post', res?.message);
        onActionDone();
        actionSheetRef.current?.hide();
      })
      .catch(err => {
        Toast.error('Report Post', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const ReportUser = async () => {
    setIsLoading(true);
    let data = {
      comment: reportItems[selectedOption]?.label,
      report_user_id: selectedUser,
    };
    await reportUserRequest(data)
      .then(res => {
        Toast.success('Report User', res?.message);
        onActionDone();
        actionSheetRef.current?.hide();
      })
      .catch(err => {
        Toast.error('Report User', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const BlockUser = async () => {
    setIsLoading(true);

    let data = {
      comment: reportItems[selectedOption]?.label,
      report_user_id: selectedUser,
    };
    await blockUserRequest(data)
      .then(res => {
        Toast.success('Block User', res?.message);
        onActionDone();
        actionSheetRef.current?.hide();
      })
      .catch(err => {
        Toast.error('Block User', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      containerStyle={styles.container}
      onClose={() => setSelectedOption(null)}>
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
            Choose one option to report.
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
                    //   item?.action();
                    //   actionSheetRef.current?.hide();
                  }}
                  style={{
                    marginVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: wp(18),
                      color: colors.black,
                    }}>
                    {item?.label}
                  </Text>

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
              </View>
            );
          })}
        </View>

        <View
          style={{
            marginBottom: wp(30),
          }}>
          <CustomButton
            isLoading={isLoading}
            disabled={selectedOption == null}
            label="Report"
            onPress={() => {
              if (selectedReportType == 'report_post') {
                ReportPost();
              } else if (selectedReportType == 'report_user') {
                ReportUser();
              } else if (selectedReportType == 'block_user') {
                BlockUser();
              }
            }}
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
export default ReportTypeOptionSheet;
