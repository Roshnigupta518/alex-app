import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import CustomButton from '../CustomButton';
import Share from 'react-native-share';
import Toast from '../../constants/Toast';
import * as RNFS from 'react-native-fs';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
const ShareSheet = forwardRef((data, ref) => {
  const shareIcons = [
    {icon: ImageConstants.round_fb, action: null},
    {icon: ImageConstants.round_insta, action: null},
    {icon: ImageConstants.round_linkedin, action: null},
    {icon: ImageConstants.round_twitter, action: null},
  ];
  const [isLoading, setisLoading] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState(null);
  const cleanAndResolve = localFile => {
    RNFS.unlink(localFile).then(resolve);
  };
  const actionSheetRef = useRef(null);
  useEffect(() => {}, [data]);

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
    <ActionSheet
      ref={actionSheetRef}
      containerStyle={styles.container}
      onClose={() => setSelectedIcon(null)}>
      <View style={styles.subView}>
        <View style={styles.drawerHandleStyle} />

        <View style={styles.commentCountView}></View>

        <View style={styles.commentListContainer}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: wp(28),
              color: colors.primaryColor,
              textAlign: 'center',
            }}>
            You have good taste!
          </Text>

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: wp(18),
              color: colors.black,
              marginVertical: 16,
              textAlign: 'center',
            }}>
            Share this post in other platforms.
          </Text>

          <View
            style={{
              marginTop: wp(20),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            {shareIcons?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIcon(index);
                  }}>
                  <Image
                    source={item?.icon}
                    style={{
                      height: wp(55),
                      width: wp(55),
                      tintColor:
                        selectedIcon == index
                          ? colors.primaryColor
                          : colors.black,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{marginTop: 30, bottom: 5}}>
            <CustomButton
              label="Share"
              isLoading={isLoading}
              onPress={async () => {
                if (selectedIcon != null) {
                  if (isLoading == false) {
                    setisLoading(true);
                    let shareoption;
                    if (selectedIcon == 1) {
                      console.log(
                        'data?.data?.postData?.post?.data',
                        data?.data?.postData?.post?.data,
                      );
                      let filePath;
                      if (
                        data?.data?.postData?.post?.mimetype == 'image/jpeg'
                      ) {
                        filePath =
                          'file://' +
                          RNFS.DocumentDirectoryPath +
                          '/' +
                          data?.data?.postData?.post?.data.replace(
                            'https://ik.imagekit.io/labvqsm7j/tourismImages/',
                            '',
                          );
                      } else {
                        filePath =
                          'file://' +
                          RNFS.DocumentDirectoryPath +
                          '/' +
                          data?.data?.postData?.post?.data.replace(
                            'https://ik.imagekit.io/labvqsm7j/',
                            '',
                          );
                      }

                      RNFS.downloadFile({
                        fromUrl: data?.data?.postData?.post?.data,
                        toFile: filePath,
                        background: true, // Enable downloading in the background (iOS only)
                        discretionary: true, // Allow the OS to control the timing and speed (iOS only)
                      }).promise.then(async response => {
                        console.log('File downloaded!', response);
                        RNFS.readFile(filePath, 'base64').then(async base64 => {
                          let shareOptions;
                          if (
                            data?.data?.postData?.post?.mimetype == 'image/jpeg'
                          ) {
                            shareOptions = {
                              backgroundImage: data?.data?.postData?.post?.data,
                              stickerImage: filePath, //or you can use "data:" link
                              backgroundBottomColor: '#fefefe',
                              backgroundTopColor: '#906df4',
                              attributionURL: data?.data?.postData?.post?.data, //in beta
                              social: Share.Social.INSTAGRAM_STORIES,
                              appId: '742487000924268',
                            };
                          } else {
                            shareOptions = {
                              backgroundVideo: filePath,
                              //or you can use "data:" link
                              backgroundBottomColor: '#fefefe',
                              backgroundTopColor: '#906df4',
                              attributionURL: data?.data?.postData?.post?.data, //in beta
                              social: Share.Social.INSTAGRAM_STORIES,
                              appId: '742487000924268',
                            };
                          }
                          console.log('shareOptions', shareOptions);
                          try {
                            let check;
                            if (Platform.OS == 'ios') {
                              check =
                                Share.isPackageInstalled('instagram://app');

                              Share.shareSingle(shareOptions)
                                .then(({action, activityType}) => {
                                  actionSheetRef.current?.hide();
                                  if (action === Share.sharedAction) {
                                    setisLoading(false);
                                    console.log('Share was successful');
                                  } else console.log('Share was dismissed');
                                })
                                .catch(err => {
                                  console.log('error: ' + err);
                                  setisLoading(false);
                                  // cleanAndResolve(filePath);
                                  actionSheetRef.current?.hide();
                                });
                            } else {
                              check = await Share.isPackageInstalled(
                                'com.instagram.android',
                              );
                              if (check?.isInstalled) {
                                Share.shareSingle(shareOptions)
                                  .then(({action, activityType}) => {
                                    actionSheetRef.current?.hide();
                                    if (action === Share.sharedAction) {
                                      setisLoading(false);
                                      console.log('Share was successful');
                                    } else console.log('Share was dismissed');

                                    setisLoading(false);

                                    actionSheetRef.current?.hide();
                                  })
                                  .catch(err => {
                                    console.log('error: ' + err);
                                    setisLoading(false);
                                    actionSheetRef.current?.hide();
                                  });
                              } else {
                                console.log('error: ' + err);
                                setisLoading(false);
                                actionSheetRef.current?.hide();
                                const appStoreUrl =
                                  'https://apps.apple.com/us/app/instagram/id389801252'; // iOS App Store URL
                                const playStoreUrl =
                                  'https://play.google.com/store/apps/details?id=com.instagram.android'; // Google Play Store URL
                                Alert.alert(
                                  'Instagram App Not Found',
                                  'The Instagram app is not installed. You can install it from the app store.',
                                  [
                                    {text: 'Cancel', style: 'cancel'},
                                    {
                                      text: 'Open App Store',
                                      onPress: () => {
                                        // Open the appropriate store based on platform
                                        const storeUrl =
                                          Platform.OS === 'ios'
                                            ? appStoreUrl
                                            : playStoreUrl;
                                        Linking.openURL(storeUrl);
                                      },
                                    },
                                  ],
                                );
                              }
                            }
                            console.log('check', check);
                          } catch (error) {
                            console.log('error: ' + error);
                          }
                        });
                      });
                    } else {
                      if (selectedIcon == 2) {
                        Linking.openURL(
                          'https://www.linkedin.com/shareArticle?mini=true&url=' +
                            data?.data?.postData?.post?.data +
                            '&text=' +
                            data?.data?.postData?.caption,
                        );
                        setisLoading(false);
                        actionSheetRef.current?.hide();
                      } else {
                        shareoption = {
                          social:
                            selectedIcon == 0
                              ? Share.Social.FACEBOOK
                              : selectedIcon == 1
                              ? Share.Social.INSTAGRAM
                              : selectedIcon == 3
                              ? Share.Social.TWITTER
                              : selectedIcon == 2
                              ? Share.Social.LINKEDIN
                              : '',
                          title: data?.data?.postData?.caption,
                          // Android
                          message: data?.data?.postData?.post?.data,
                          //ios

                          url: data?.data?.postData?.post?.data,
                        };
                        setisLoading(false);
                        if (Platform.OS == 'ios' && selectedIcon == 3) {
                          const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            data?.data?.postData?.caption,
                          )}&url=${encodeURIComponent(
                            data?.data?.postData?.post?.data,
                          )}`;
                          Linking.openURL(twitterShareUrl);
                          actionSheetRef.current?.hide();
                          setisLoading(false);
                        } else {
                          Share.shareSingle(shareoption, {
                            dialogTitle: 'Share Post',
                          })
                            .then(({action, activityType}) => {
                              actionSheetRef.current?.hide();
                              if (action === Share.sharedAction) {
                                setisLoading(false);
                                console.log('Share was successful');
                              } else console.log('Share was dismissed');
                            })
                            .catch(err => {
                              actionSheetRef.current?.hide();
                              setisLoading(false);
                            });
                        }
                      }
                    }
                  }
                } else {
                  Toast.error(
                    'error',
                    'Please select the social media platform.',
                  );
                }
              }}
            />
          </View>
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
    color: colors.black,
    textAlign: 'center',
  },

  commentListContainer: {
    height: HEIGHT / 2.7,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },

  userImageStyle: {
    backgroundColor: colors.white,
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
    color: colors.black,
    marginTop: 10,
  },

  lineSaparatorStyle: {
    backgroundColor: colors.black,
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
export default ShareSheet;
