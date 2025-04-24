import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {SwipeListView} from 'react-native-swipe-list-view';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import {
  DeleteCommentRequest,
  GetAllCommentRequest,
  PostCommentRequest,
} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {useSelector} from 'react-redux';

const CommentListSheet = forwardRef(
  (
    {
      postId = '',
      commentCount = 0,
      onCommentDelete = () => {},
      onCommentAdded = () => {},
      onDelete = () => {},
    },
    ref,
  ) => {
    const userInfo = useSelector(state => state.UserInfoSlice.data);

    const actionSheetRef = useRef(null);
    const swipeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commentTxt, setCommentTxt] = useState('');
    const [isSelfComment, setIsSelfComment] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const GetAllComments = id => {
      setIsLoading(true);
      GetAllCommentRequest(id)
        .then(res => {
          setCommentList(res?.result || []);
        })
        .catch(err => {
          Toast.error('Comments', err?.message);
        })
        .finally(() => setIsLoading(false));
    };

    const PostComment = () => {
      PostCommentRequest(postId, {comment: commentTxt})
        .then(res => {
          console.log('Res=-=-', res);
          setCommentTxt('');
          if (!isSelfComment) {
            Toast.success('Comment', res?.message);
          } else {
            Toast.success('Comment', 'You commented on your post.');
          }
          GetAllComments(postId);
          onCommentAdded();
          actionSheetRef.current?.hide(false);
        })
        .catch(err => {
          Toast.error('Comment', err?.message);
        });
    };

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true); // or some other action
        },
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false); // or some other action
        },
      );
      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }, []);

    // useEffect(() => {
    //   GetAllComments(postId);
    // }, [postId]);

    // Expose actionSheetRef to parent component through forwarded ref
    React.useImperativeHandle(ref, () => ({
      show: userId => {
        if (userId == userInfo?.id) {
          setIsSelfComment(true);
        } else {
          setIsSelfComment(false);
        }
        actionSheetRef.current?.show();
      },
      hide: () => {
        actionSheetRef.current?.hide(false);
      },
    }));

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

      for (const [unit, interval] of Object.entries(intervals)) {
        if (interval >= 1) {
          return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
      }

      return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
    }

    const EmptyListRender = () => {
      return (
        <View
          style={{
            height: isKeyboardVisible ? HEIGHT / 3.3 : HEIGHT / 2.7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isLoading ? (
            <ActivityIndicator color={colors.primaryColor} size={'large'} />
          ) : (
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: wp(14),
                color: colors.black,
              }}>
              No comment to show!
            </Text>
          )}
        </View>
      );
    };

    return (
      <ActionSheet
        ref={actionSheetRef}
        onClose={() => setCommentList([])}
        onOpen={() => {
          setCommentList([]);
          GetAllComments(postId);
        }}
        containerStyle={styles.container}>
        <View style={styles.subView}>
          <View style={styles.drawerHandleStyle} />

          <View style={styles.commentCountView}>
            <Text style={styles.commentCountTxt}>
              {commentCount != 0 ? commentCount : ''}{' '}
              {commentCount < 2 ? 'Comment' : 'Comments'}
            </Text>
          </View>

          <View style={styles.commentListContainer(isKeyboardVisible)}>
            <SwipeListView
              ref={swipeRef}
              data={commentList}
              ListEmptyComponent={<EmptyListRender />}
              renderItem={({item}, rowMap) => {
                return (
                  <View style={styles.userImageStyle}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={
                          item?.user_id?.profile_picture
                            ? {
                                uri: item?.user_id?.profile_picture,
                              }
                            : ImageConstants.user
                        }
                        style={styles.userImageView}
                      />

                      <View style={styles.userCotentContainer}>
                        <Text style={styles.usernameStyle}>
                          {item?.user_id?.anonymous_name}
                        </Text>
                        <Text style={styles.userCommentStyle}>
                          {item?.comment}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.timeStyle}>
                      {timeAgo(new Date(item?.updated_at))}
                    </Text>
                  </View>
                );
              }}
              disableRightSwipe={true}
              renderHiddenItem={({item}, rowMap) => {
                if (userInfo?.id == item?.user_id?._id) {
                  return (
                    <View style={styles.drawerStyle}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          onCommentDelete(item?._id);
                          actionSheetRef.current?.hide();
                        }}
                        style={styles.deleteIconView}>
                        <Image
                          source={ImageConstants.delete}
                          style={styles.iconStyle}
                        />
                        <Text style={styles.itemNameStyle}>Delete</Text>
                      </TouchableOpacity>

                      {/* <View style={styles.lineSaparatorStyle} /> */}
                      {/* <View style={styles.deleteIconView}>
                        <Image
                          source={ImageConstants.edit_comment}
                          style={styles.iconStyle}
                        />
                        <Text style={styles.itemNameStyle}>Edit</Text>
                      </View> */}
                    </View>
                  );
                }
              }}
              leftOpenValue={75}
              rightOpenValue={-150}
            />
          </View>

          <View style={styles.commentInputView}>
            <View style={styles.inputStyleView}>
              <TextInput
                value={commentTxt}
                placeholder="Write your comment"
                onChangeText={txt => setCommentTxt(txt)}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                }}
              />
            </View>

            <TouchableOpacity
              disabled={commentTxt?.length == 0}
              onPress={PostComment}
              style={styles.sendButtonStyle}>
              <Image
                source={ImageConstants.send}
                style={{
                  height: wp(24),
                  width: wp(24),
                }}
              />
            </TouchableOpacity>
          </View>

          {isKeyboardVisible && <View style={styles.spaceBoxView} />}
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
    color: colors.black,
  },

  commentListContainer: isKeyboardVisible => {
    return {
      height: isKeyboardVisible ? HEIGHT / 3.3 : HEIGHT / 2.7,
      backgroundColor: colors.white,
    };
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
    color: colors.black,
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

  commentInputView: {
    padding: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  inputStyleView: {
    backgroundColor: colors.white,
    width: WIDTH / 1.27,
    borderRadius: 30,
    borderWidth: 1,
  },

  sendButtonStyle: {
    height: wp(45),
    width: wp(45),
    backgroundColor: colors.primaryColor,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  spaceBoxView: {
    height: HEIGHT / 2.8,
    backgroundColor: colors.white,
  },

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    width: WIDTH / 6,
    textAlign: 'right',
  },
});
export default CommentListSheet;
