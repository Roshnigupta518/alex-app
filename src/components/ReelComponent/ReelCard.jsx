import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './ReelStyle/ReelCard.Style';
import VideoPlayer from './VideoPlayer';
import ImageConstants from '../../constants/ImageConstants';
import {useDispatch, useSelector} from 'react-redux';
import {ChangeMuteAction} from '../../redux/Slices/VideoMuteSlice';
import {LikeDisLikeRequest, SavePostRequest} from '../../services/Utills';
import Toast from '../../constants/Toast';
import {useNavigation} from '@react-navigation/native';
import {colors, fonts, wp} from '../../constants';
import ReadMore from '@fawazahmed/react-native-read-more';
import crashlytics from '@react-native-firebase/crashlytics';
import { handleShareFunction, handleSharePostFunction } from '../../validation/helper';

const ReelCard = ({
  data,
  idx = 0,
  screen = '',
  isItemOnFocus = false,
  onCommentClick = () => {},
  onShareClick = () => {},
  onMenuClick = () => {},
  onFollowingUserClick = () => {},
  screenHeight,
  currentIndex, isStoryOpen
}) => {
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const shouldMute = useSelector(state => state.VideoMuteSlice.isMute);

  const isItemOnFocusnew = idx === currentIndex;

  const isPaused = isStoryOpen || !isItemOnFocusnew;


  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(data?.isLiked || false);
  const [likeCount, setLikeCount] = useState(data?.like || 0);
  const [isSaved, setIsSaved] = useState(data?.isSaved || false);
  const [shouldPlay, setShouldPlay] = useState(isItemOnFocus);
  const [muteIconVisible, setMuteIconVisible] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  // console.log({screenHeight})
  useEffect(() => {
    setShouldPlay(
      isItemOnFocus && data?.postData?.post?.mimetype == 'video/mp4',
    );
  }, [isItemOnFocus]);

  const likePost = async isLike => {
    let likeData = {
      post_id: data?.postData?._id,
      type: isLike ? '1' : '2', //1=Like,2=Unlike
    };

    await LikeDisLikeRequest(likeData).catch(err =>
      Toast.error('Like', err?.message),
    );
  };

  const savePost = async () => {
    setIsSaved(!isSaved);
    await SavePostRequest(data?.postData?._id)
      .then(res => {
        if (userInfo?.id != data?.postData?.user_id?._id) {
          Toast.success('Post', res?.message);
        } else {
          Toast.success(
            'Post',
            !isSaved
              ? 'Your Post Saved Successfully.'
              : 'You unsaved your post successfully.',
          );
        }
      })
      .catch(err => {
        Toast.error('Save', err?.message);
      });
  };

  const changeMuteState = () => {
    setMuteIconVisible(true);
    dispatch(ChangeMuteAction(!shouldMute));
    setTimeout(() => {
      setMuteIconVisible(false);
    }, 2000);
  };

  function formatPostDate(isoDate) {
    const createdAt = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
  
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else {
      // Show as date (e.g., Nov 28, 2024)
      const options = { year: "numeric", month: "short", day: "numeric" };
      return createdAt.toLocaleDateString("en-US", options);
    }
  }

  const onPressHandle = (data) => {
    const tagBusiness = data?.postData?.tagBussiness?.length>0 &&data?.postData?.tagBussiness[0]
    if(data.postData.added_from == '1'){
    if (userInfo?.id == data?.postData?.user_id?._id) {
      navigation.navigate('ProfileDetail', {
        userId: data?.postData?.user_id?._id,
      });
    } else {
      navigation.navigate('UserProfileDetail', {
        userId: data?.postData?.user_id?._id,
      });
    }
  }else{
    navigation.navigate('ClaimBusinessScreen', {
      ...tagBusiness,
      screen: screen,
    });
  }
  }

  useEffect(() => {
    console.log(
      `🎬 ReelCard [${idx}] -> focus: ${isItemOnFocus}, paused: ${isPaused}`
    );
  }, [isStoryOpen, isItemOnFocus]);
  
 
  return (
    <View style={[styles.container,{height:screenHeight}]} key={idx}>
      {data?.postData?.post?.mimetype == 'video/mp4' ? (
       <TouchableOpacity
       activeOpacity={1}
       style={{ flex: 1 }}
       onPress={() => {
         setManualPaused(prev => !prev);
         console.log(`🎬 ReelCard [${idx}] -> manualPaused: ${!manualPaused}`);
       }}
     >
       <VideoPlayer
         url={data?.postData?.post?.data}
         shouldPlay={shouldPlay}
         onMuteClick={changeMuteState}
         screen={screen}
         screenHeight={screenHeight}
         isPaused={isPaused || shouldPlay}
       />
     </TouchableOpacity>
      ) : (
        <Image
          source={{
            uri: data?.postData?.post?.data,
          }}
          style={[styles.uploadedImageStyle(screen == 'Reel'),{height:screenHeight}]}
        />
      )}

      <View style={[styles.firstRowContainer(screen == 'Reel')]}>
        {/* First Profile View Row */}
        <View style={styles.subFirstRowContiner}>
          <View style={styles.userImageContainer}>
            {/* User Image */}
            <View style={styles.imageView}>
              <TouchableOpacity
                onPress={() => {
                  onPressHandle(data)
                }}>
               <Image
  source={
    data.postData.added_from == '1'
      ? data?.postData?.user_id?.profile_picture?.trim()
        ? { uri: data?.postData?.user_id?.profile_picture }
        : ImageConstants.user
      : data?.postData?.tagBussiness?.[0]?.profile_picture?.trim()
        ? { uri: data?.postData?.tagBussiness[0]?.profile_picture }
        : ImageConstants.business_logo
  }
  style={styles.imageStyle}
/>
              </TouchableOpacity>
              {data?.postData?.user_id?._id != userInfo?.id && (
                <TouchableOpacity
                  onPress={onFollowingUserClick}
                  style={styles.plusContainer}>
                  <Image
                    source={ImageConstants.blue_plus}
                    style={styles.plusImageStyle}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Username and Location */}
            <View style={styles.usernameStyle}>
              <TouchableOpacity
                onPress={() => {
                  onPressHandle(data)
                }}>
                <Text numberOfLines={1} style={styles.nameTxtStyle}>
                  {data.postData.added_from == '1' ? 
                  data?.postData?.user_id?.anonymous_name : 
                  data?.postData?.tagBussiness?.length>0 ? 
                  data?.postData?.tagBussiness[0]?.name : ''}
                </Text>
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.locationTxtStyle}>
                {data?.postData?.city}
              </Text>
            </View>
          </View>

          {/* horizontal menu icon */}
          <View>
            {/* {userInfo?.id != data?.postData?.user_id?._id && ( */}
              <TouchableOpacity onPress={onMenuClick}>
                <Image
                  source={ImageConstants.h_menu}
                  style={styles.hmenuStyle}
                />
              </TouchableOpacity>
            {/* )} */}
          </View>
        </View>

        {/* Like comment share row */}
        <View style={styles.secondRowContainer}>
          <View style={styles.subSecondRowContainer}>
            <TouchableOpacity
              onPress={() => {
                if (isLiked) {
                  likePost(false);
                  setLikeCount(likeCount - 1);
                  setIsLiked(false);
                } else {
                  likePost(true);
                  setLikeCount(likeCount + 1);
                  setIsLiked(true);
                }
              }}
              style={styles.likeContainer}>
              <Image
                source={
                  isLiked ? ImageConstants.filled_like : ImageConstants.unlike
                }
                style={styles.likeImageStyle(isLiked)}
              />
              <Text style={styles.likeCountStyle}>
                {likeCount != 0 && likeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onCommentClick(idx)}
              style={styles.commentContainer}>
              <Image
                source={ImageConstants.comment}
                style={styles.commentIconStyle}
              />
              <Text style={styles.commentCountStyle}>
                {data?.comment != 0 && data?.comment}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={onShareClick}
              onPress={()=>handleSharePostFunction(data)}
              style={styles.sendContainer}>
              <Image
                source={ImageConstants.send}
                style={styles.sendImageStyle}
              />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={savePost}>
              <Image
                source={isSaved ? ImageConstants.saved : ImageConstants.save}
                style={styles.saveIconStyle}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrption View */}
        <ReadMore
          numberOfLines={2}
          style={styles.descriptionTxtStyle}
          seeMoreStyle={{color: colors.primaryColor}}
          seeLessStyle={{color: colors.primaryColor}}>
          {data?.postData?.caption}
        </ReadMore>

        {data?.postData?.taggedUsers && (
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            {data?.postData?.taggedUsers.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProfileDetail', {userId: item?._id})
                  }>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: colors.primaryColor,
                      fontSize: wp(13),
                    }}>
                    {'@' + item?.anonymous_name}
                    {data?.postData?.taggedUsers?.length - 1 == index
                      ? ''
                      : ', '}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {data?.postData?.tagBussiness?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ClaimBusinessScreen', {
                    ...item,
                    screen: screen,
                  });
                }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    color: colors.primaryColor,
                    fontSize: wp(13),
                  }}>
                  {item?.name}{' '}
                  {index == data?.postData?.tagBussiness?.length - 1
                    ? ''
                    : ', '}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text numberOfLines={1} style={styles.locationTxtStyle}>
                {formatPostDate(data?.postData?.created_at)}
              </Text>
      </View>

      {muteIconVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={changeMuteState}
          style={styles.muteContainer}>
          <Image
            source={
              shouldMute ? ImageConstants.audio_off : ImageConstants.audio_on
            }
            style={styles.muteIconStyle}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReelCard;
