import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  BackHandler,
  Image, TouchableOpacity,
  Text, Platform, PermissionsAndroid, AppState, ScrollView, Linking, SafeAreaView
} from 'react-native';
import { colors, fonts, HEIGHT, wp } from '../../../constants';
import ReelHeader from '../../../components/ReelComponent/ReelHeader';
import ReelCard from '../../../components/ReelComponent/ReelCard';
import { useIsFocused } from '@react-navigation/native';
import CommentListSheet from '../../../components/ActionSheetComponent/CommentListSheet';
import { GetAllPostsRequest, GetAllStoryRequest, likeStoryRequest, makeStorySeenRequest } from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import { useDispatch, useSelector } from 'react-redux';
import ShareSheet from '../../../components/ActionSheetComponent/ShareSheet';
import ReportActionSheet from '../../../components/ActionSheetComponent/ReportActionSheet';
import ReportTypeOptionSheet from '../../../components/ActionSheetComponent/ReportTypeOptionSheet';
import FollowUserSheet from '../../../components/ActionSheetComponent/FollowUserSheet';
import DeleteCommentSheet from '../../../components/ActionSheetComponent/DeleteCommentSheet';
import { ReelIndexAction } from '../../../redux/Slices/ReelIndexSlice';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import crashlytics from '@react-native-firebase/crashlytics';
import Geolocation from '@react-native-community/geolocation';
import { setCityAction } from '../../../redux/Slices/SelectedCitySlice';
import useLocation from '../../../hooks/useLocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import InstagramStories from '@birdwingo/react-native-instagram-stories';
import ImageConstants from '../../../constants/ImageConstants';
import { handleShareStoryFunction } from '../../../validation/helper';

const staticValues = {
  skip: 0,
  limit: 5,
  totalRecords: 0,
  currentTotalItems: 0,
  isLoading: false,
};
const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const nearByType = useSelector(state => state.NearBySlice?.data);
  const selectedCityData = useSelector(state => state.SelectedCitySlice?.data);
  const reelIndex = useSelector(state => state.ReelIndexSlice?.data);
  const userInfo = useSelector(state => state.UserInfoSlice.data);

  const tabBarHeight = useBottomTabBarHeight();
  // const screenHeight = (HEIGHT-tabBarHeight) 
  const screenHeight = Platform.OS == 'ios' ? HEIGHT : HEIGHT - tabBarHeight
  // console.log({tabBarHeight, screenHeight})
  const storyref = useRef(null)
  const prevNearBy = useRef(nearByType);
  const prevLocationTypeRef = useRef(selectedCityData?.locationType);

  const flashListRef = useRef();
  const deleteCommentRef = useRef();
  const isFocused = useIsFocused();
  const actionsheetRef = useRef();
  const followingUserRef = useRef();
  const shareSheetRef = useRef();
  const prevNearByTypeRef = useRef(nearByType);
  const menuSheetRef = useRef();
  const reportOptionSheet = useRef();
  const [isOnFocusItem, setIsOnFocusItem] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [postArray, setPostArray] = useState([]);
  const [paramsValues, setParamsValues] = useState({
    location_title: 'Global',
    location_type: 'global',
    location_coordinates: null,
    location_distance: null,
    city: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    skip: staticValues.skip,
    limit: staticValues.limit,
    totalRecords: staticValues.totalRecords,
    currentTotalItems: staticValues.currentTotalItems,
    isLoading: staticValues.isLoading,
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [hasTriedFetchingPosts, setHasTriedFetchingPosts] = useState(false);
  const [stories, setStories] = useState([])
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5); // fix limit as per API
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 
  const [currentStory, setCurrentStory] = useState({ userId: null, storyId: null });
  const [likedStories, setLikedStories] = useState([]); // store liked storyIds
  const [isLiked, setIsLiked] = useState(false);

  const { openStoryId } = route.params || {};

  const { location, city, error, permissionGranted, refreshLocation } = useLocation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected === false) {
        // Set internet connection status to false when not connected
        setIsInternetConnected(false);
        console.log('No internet connection');
      } else if (
        state.isConnected === true &&
        state.isInternetReachable !== undefined
      ) {
        // Only update when connection is reachable
        console.log(
          'State of Internet reachability: ',
          state.isInternetReachable,
        );

        // Set connection status based on reachability
        setIsInternetConnected(state.isInternetReachable);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  const onRefresh = React.useCallback(async () => {
    getStoryHandle()
    // setRefreshing(true);
    setIsLoading(true)
    console.log('call this refresh***************')
    console.log({ selectedCityData, paramsValues, currentCity: city })

    pagination.skip = staticValues.skip;
    pagination.limit = staticValues.limit;
    pagination.totalRecords = staticValues.totalRecords;
    pagination.currentTotalItems = staticValues.currentTotalItems;
    pagination.isLoading = staticValues.isLoading;

    setPostArray([]);
    await refreshLocation();
    getAllPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [paramsValues, selectedCityData, city, refreshLocation]);

  const getAllPosts = () => {
    // console.log({ selectedCityData, paramsValues, currentCity: city });

    if (selectedCityData?.locationType == 'current') {
      if (city == null && error == null) {
        // Still resolving location – do nothing
        return;
      }
      if (!!error) {
        // Got location error
        setIsLoading(false);
        setHasTriedFetchingPosts(true);
        return;
      }
    }

    pagination.isLoading = true;

    // Only set isLoading when postArray is empty (for UX reasons)
    if (postArray?.length === 0) {
      setIsLoading(true);
    }

    let url = { skip: pagination.skip, limit: pagination.limit };

    if (selectedCityData?.locationType == 'current') {
      Object.assign(url, { city: city });
    } else if (paramsValues?.location_type == 'city') {
      Object.assign(url, { city: paramsValues?.city });
    } else if (paramsValues?.location_type == 'nearme') {
      Object.assign(url, {
        latitude: paramsValues?.location_coordinates?.latitude,
        longitude: paramsValues?.location_coordinates?.longitude,
        distance: paramsValues?.location_distance,
      });
    }

    GetAllPostsRequest(url)
      .then(res => {
        // setPostArray(prevPosts => [...prevPosts, ...res?.result]);
        setPostArray(prevPosts => {
          const merged = [...prevPosts, ...res?.result];
          const uniquePosts = Array.from(
            new Map(merged.map(item => [item?.postData?._id, item])).values()
          );
          return uniquePosts;
        });


        // Prefetch images
        res?.result?.forEach(item => {
          if (item?.postData?.post?.mimetype == 'image/jpeg') {
            Image.prefetch(item?.postData?.post?.data);
          }
        });

        pagination.totalRecords = res?.totalrecord;
        setHasTriedFetchingPosts(true);
      })
      .catch(err => {
        if (err?.message) {
          Toast.error('Posts', err.message);
        }
        setHasTriedFetchingPosts(true);
      })
      .finally(() => {
        pagination.isLoading = false;
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const transformApiToDummy = (apiData) => {
    return apiData.map(user => ({
      id: user.added_from === "2" 
      ? user.business_id : user.user_id,
      name: user.user_name,
      avatarSource: user.user_image 
      ? { uri: user.user_image }
      : user.added_from === "2" ? ImageConstants.business_logo : ImageConstants.user,
      stories: user.stories.map(story => ({
        id: story.id,
        mediaType: story.media_type === 'video/mp4' ? 'video' : 'image',
        duration: story.duration,
        source: { uri: story.media },
        is_seen : story.is_seen,
        is_liked : story.is_liked,
      }))
    }));
  };


  // const getStoryHandle = () => {
  //   console.log('**********************story updated', hasMore, loading)
  //   if (loading || !hasMore) return;

  //   let url = { skip: skip, limit: limit };
  //   GetAllStoryRequest(Object.assign(url))
  //     .then(res => {
  //       const dummyFormat = transformApiToDummy(res.result);
  //       console.log({ res: dummyFormat.length })

  //       if (dummyFormat?.length > 0) {
  //         setStories(prev => [...prev, ...dummyFormat]);
  //         setSkip(prev => prev + limit);
  //         if (dummyFormat.length < limit) {
  //           setHasMore(false);
  //         }
  //       } else {
  //         setHasMore(false);
  //       }
  //     }
  //     )
  //     .catch(err => {
  //       if (err?.message) {
  //         Toast.error('stories', err.message);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }

  // Story khatam hone par seen true karna
  
  // const getStoryHandle = () => {
  //   console.log('**********************story updated', hasMore, loading)
  //   if (loading || !hasMore) return;
  
  //   let url = { skip: skip, limit: limit };
  //   GetAllStoryRequest(Object.assign(url))
  //     .then(res => {
  //       const dummyFormat = transformApiToDummy(res.result);
  //       console.log({ res: dummyFormat.length })
  
  //       if (dummyFormat?.length > 0) {
  //         // ✅ "Your Story" object inject karo
  //         const yourStoryObj = {
  //           id: userInfo.id,
  //           name: 'Add story',
  //           isAddButton: true,
  //           avatarSource: {uri: userInfo.profile_picture} || ImageConstants.user,
  //           stories: [],
  //         };
  
  //         // ✅ Merge
  //         setStories(prev => {
  //           const merged = skip === 0
  //             ? [yourStoryObj, ...dummyFormat] // first fetch
  //             : [...prev, ...dummyFormat];     // pagination
  
  //           return merged;
  //         });
  
  //         setSkip(prev => prev + limit);
  //         if (dummyFormat.length < limit) {
  //           setHasMore(false);
  //         }
  //       } else {
  //         if (skip === 0) {
  //           const yourStoryObj = {
  //             id: userInfo.id,
  //             name: 'Add story',
  //             isAddButton: true,
  //             avatarSource: {uri: userInfo.profile_picture} || ImageConstants.user,
  //             stories: [],
  //           };
  //           setStories([yourStoryObj]);
  //         }
  //         setHasMore(false);
  //       }
  //     })
  //     .catch(err => {
  //       if (err?.message) {
  //         Toast.error('stories', err.message);
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  
  
  
  const getStoryHandle = () => {
    console.log('**********************story updated', hasMore, loading);
    if (loading || !hasMore) return;
  
    let url = { skip, limit };
    GetAllStoryRequest(url)
      .then(res => {
        const dummyFormat = transformApiToDummy(res.result);
        console.log({ res: dummyFormat.length });
  
        // Check if my story exists in API response
        const myStoryFromApi = dummyFormat.find(s => s.id === userInfo.id);
  
        let yourStoryObj = {
          id: userInfo.id,
          name: 'Your Story',
          avatarSource: { uri: userInfo.profile_picture } || ImageConstants.user,
          stories: myStoryFromApi ? myStoryFromApi.stories : [],
          // isAddButton: !myStoryFromApi || (myStoryFromApi.stories?.length === 0),
          isAddButton: true,

        };
  
        let finalStories;
        if (skip === 0) {
          // Remove my story from API list (to avoid duplicate)
          const others = dummyFormat.filter(s => s.id !== userInfo.id);
          finalStories = [yourStoryObj, ...others];
        } else {
          finalStories = [...stories, ...dummyFormat];
        }
  
        setStories(finalStories);
  
        setSkip(prev => prev + limit);
        if (dummyFormat.length < limit) {
          setHasMore(false);
        }
      })
      .catch(err => {
        if (err?.message) {
          Toast.error('stories', err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  


  const handleStorySeen = (userId, storyId) => {
    setStories((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              stories: user.stories.map((s) =>
                s.id === storyId ? { ...s, is_seen: true } : s
              ),
            }
          : user
      )
    );
  };

  useEffect(() => {
    if (isFocused && route?.params?.shouldScrollTopReel) {
      // reset first
      setSkip(0);
      setHasMore(true);
      setStories([]);
      setLoading(false); // make sure not loading before fetch
    }
  }, [isFocused, route?.params?.shouldScrollTopReel]);
  
  useEffect(() => {
    // jab hasMore true ho jaye & isFocused ho, tab fetch karo
    if (isFocused && hasMore && skip === 0) {
      setLoading(true);
      getStoryHandle();
    }
  }, [isFocused, hasMore, skip]);
  
  useEffect(() => {
    if (openStoryId && stories.length > 0) {
      const index = stories.findIndex(s => s.id === openStoryId);
      if (index !== -1) {
        // Agar InstagramStories me openStory method hai to
        storyref.current?.scrollToStory(index);
      }
    }
  }, [openStoryId, stories]);

  // console.log({openStoryId})

  const markStoryAsSeen = async (storyId) => {
    try {
      const res = await makeStorySeenRequest(storyId);
      console.log('story seen ho gyi', storyId, res);
    } catch (err) {
      console.log({err})
      if (err?.message) {
        Toast.error('view stories', err.message);
      }
    }
  };

  const likeStoryHandle = async (storyId) => {
    try {
      const res = await likeStoryRequest(storyId);
      Toast.success('Story', res?.message, 'bottom');
      console.log('story like ho gyi', storyId, res);
  
      // ✅ Update local `isLiked` for current story preview
      setIsLiked(prev => !prev);
  
      // ✅ Update the story list state so the like count / status updates in UI
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === storyId
            ? {
                ...story,
                isLiked: !story.isLiked,
              }
            : story
        )
      );
  
      

    } catch (err) {
      console.log({ err });
      if (err?.message) {
        Toast.error('Like stories', err.message, 'bottom');
      }
    }
  };
  
  
  const _onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]) {
      const index = viewableItems[0]?.index;
      setCurrentItemIndex(index);
      dispatch(ReelIndexAction(index));
      console.log({ currentItemIndex })
      // Load more if needed
      if (pagination.skip < pagination.totalRecords &&
        postArray?.length - 2 <= index &&
        !pagination.isLoading) {
        pagination.skip += pagination.limit;
        getAllPosts();
      }
    }
  }, [postArray.length, pagination]);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  useEffect(() => {
    // setIsLoading(true)
    paramsValues.location_title = nearByType?.location_title;
    paramsValues.location_type = nearByType?.location_type;
    paramsValues.location_coordinates = nearByType?.location_coordinates;
    paramsValues.location_distance = nearByType?.location_distance;
    paramsValues.city = nearByType?.city;
  }, [nearByType]);

  useEffect(() => {
    if (!isFocused) {
      setIsOnFocusItem(false);
      return;
    }

    if ((error || !city) && selectedCityData?.locationType === 'current') {
      setIsLoading(false);
      return;
    }

    const nearByChanged = JSON.stringify(prevNearByTypeRef.current) !== JSON.stringify(nearByType);
    const locationTypeChanged = prevLocationTypeRef.current !== selectedCityData?.locationType;

    console.log({ nearByChanged, locationTypeChanged, locationType: selectedCityData?.locationType });

    if (route?.params?.shouldScrollTopReel || nearByChanged || locationTypeChanged) {
      setPostArray([]);
      onRefresh();
      getStoryHandle()
      prevNearByTypeRef.current = nearByType;
      prevLocationTypeRef.current = selectedCityData?.locationType;

      if (route?.params?.shouldScrollTopReel) {
        navigation.setParams({ shouldScrollTopReel: false });
      }
    } else if (postArray?.length === 0) {
      getAllPosts();
    } else {
      setTimeout(() => {
        flashListRef?.current?.scrollToIndex({
          index: currentItemIndex,
          animated: false,
        });
      }, 100);
    }

    setIsOnFocusItem(true);
  }, [isFocused, city, selectedCityData, error]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Exit From Alex',
          'Are you sure you want to close this application?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ],
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => { });

    return () => {
      unsubscribe();
      flashListRef.current?.removeAllListeners?.();
    };
  }, []);

  useEffect(() => {
    if (reelIndex === 0 && postArray?.length > 0) {
      const timer = setTimeout(() => {
        if (flashListRef?.current) {
          flashListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
      }, 100); // wait for the list to mount
      return () => clearTimeout(timer);
    }
  }, [reelIndex]);

  const _renderReels = useCallback(
    ({ item, index }) => {
      return (
        <View style={[styles.cardContainer, { height: screenHeight }]} key={index}>
          <ReelCard
            idx={index}
            screen={'Home'}
            data={item}
            onCommentClick={idx => {
              actionsheetRef.current?.show(
                postArray[idx]?.postData?.user_id?._id,
              );
            }}
            onFollowingUserClick={() => followingUserRef.current?.show()}
            onMenuClick={() => menuSheetRef.current?.show()}
            onShareClick={() => shareSheetRef.current?.show()}
            isItemOnFocus={currentItemIndex == index && isOnFocusItem}
            screenHeight={screenHeight}
          />
        </View>
      );
    },
    [postArray, currentItemIndex, isOnFocusItem],
  );
  const getItemLayout = (data, index) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index,
  });

  const shouldShowLoader =
    !hasTriedFetchingPosts || isLoading || (selectedCityData?.locationType === 'current' && city == null && error == null);

  const shouldShowEmptyMessage =
    hasTriedFetchingPosts && !isLoading && postArray.length === 0 && (city !== null || error !== null);

  const shouldShowLocationError =
    selectedCityData?.locationType === 'current' && !!error && postArray.length === 0;

  return (
    <>
      <View style={styles.container}>
        <ReelHeader
          onSearchClick={() => navigation.navigate('SearchScreen')}
          onNearByClick={() => navigation.navigate('NearByScreen')}
          notificationClick={() => navigation.navigate('NotificationScreen')}
          onTempaClick={() => {
            dispatch(setCityAction({ locationType: 'current' }))
            setPostArray([])
          }}
          selectedCity={selectedCityData?.locationType}
          currentCity={city}
        />
     
        <View style={styles.storyContainer}>
        {stories.length > 0 &&
          <SafeAreaView >
            <InstagramStories
              ref={storyref}
              stories={stories}
              onStoryPress={(story) => {
                storyref.current?.open(story.id);
              }}
              onAddPress={() => navigation.navigate('AddStory',{added_from: 1})} 
              animationDuration={5000}
              // videoAnimationMaxDuration={30000}
              // saveProgress={false}
              avatarSize={60}
              storyContainerStyle={{ margin: 0, padding: 0 }}
              progressContainerStyle={{ margin: 0, padding: 0 }}
              containerStyle={{ marginTop: Platform.OS === 'android' && "-20%", zIndex: 3, }}
              closeIconColor='#fff'
              progressColor={colors.gray}
              progressActiveColor={colors.primaryColor}
              showName={true}
              nameTextStyle={{ color: colors.white, textAlign: 'center' }}
              textStyle={{ color: colors.white }}
              footerComponent={() => {
                return(
                <View style={{
                  width: '100%',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                  <TouchableOpacity
                  //  disabled={isLiked}
                  style={{ marginRight: 20 }}
                   onPress={()=>likeStoryHandle(currentStory?.storyId)} >
                    <Image 
                    source={isLiked ? ImageConstants.filled_like : ImageConstants.unlike} 
                    tintColor={isLiked ? colors.primaryColor : colors.white} 
                    style={{resizeMode:'contain'}}
                  />
                  </TouchableOpacity >
                  <TouchableOpacity onPress={()=>handleShareStoryFunction(currentStory?.storyId)}>
                    <Image source={ImageConstants.share}  />
                  </TouchableOpacity>
                </View>
              )}}
              onStoryStart={(userId, storyId) => {
                console.log({userId, storyId});
                setCurrentStory({ userId, storyId });
                markStoryAsSeen(storyId);
                handleStorySeen(userId, storyId)
                const parentUser = stories.find(user => user.id === userId);
                const storyObj = parentUser?.stories.find(s => s.id === storyId);
                console.log({storyObj})
                if (storyObj) {
                  setIsLiked(storyObj.is_liked); 
                }
              }}
            avatarBorderColors={['#0896E6','#FFE35E','#FEDF00','#55A861', '#2291CF']}
            avatarSeenBorderColors={[colors.gray]}
            saveProgress={true}
            />
          </SafeAreaView>
        }
       
        </View>

        <ScrollView contentContainerStyle={{ flex: 1 }} nestedScrollEnabled={true} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {shouldShowLoader ? (
            // Show loader
            <View style={{
              alignItems: 'center',
              height: screenHeight / 1.2,
              justifyContent: 'center',
            }}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
            // null

          ) : postArray?.length > 0 ? (
            // Show post list
            <View
              style={{
                alignItems: 'center',
                height: screenHeight,
                justifyContent: 'center',
              }}>
              <FlatList
                // refreshControl={
                //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                // }
                nestedScrollEnabled={true}
                ref={flashListRef}
                data={postArray}
                renderItem={_renderReels}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={currentItemIndex}
                disableIntervalMomentum
                onViewableItemsChanged={_onViewableItemsChanged}
                viewabilityConfig={_viewabilityConfig}
                estimatedItemSize={2}
                pagingEnabled
                initialNumToRender={2}
                removeClippedSubviews={true}
                windowSize={5}
                maxToRenderPerBatch={5}
                getItemLayout={getItemLayout}
                contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
                contentContainerStyle={{
                  alignSelf: 'center',
                }}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                extraData={screenHeight}
              />
            </View>
          ) :
            shouldShowLocationError ? (

              <View style={{
                flex: 1,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: wp(16),
                    color: colors.white,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  Failed to fetch location. Please enable location services.
                </Text>

                <Text
                  onPress={() => {
                    setIsLoading(true);
                    refreshLocation(); // Retry location fetch
                  }}
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: wp(14),
                    color: colors.primary,
                    textDecorationLine: 'underline',
                  }}>
                  Retry
                </Text>
              </View>
            ) :

              shouldShowEmptyMessage ? (
                <View style={{
                  flex: 1,
                  backgroundColor: colors.black,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text
                    onPress={() => {
                      if (selectedCityData?.locationType === 'current') {
                        navigation.navigate('PostMediaScreen');
                      }
                    }}
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: wp(16),
                      color: colors.white,
                    }}>
                    {selectedCityData?.locationType === 'current'
                      ? 'Be the first one to post in this city'
                      : 'No post found!'}
                  </Text>
                </View>
              ) : null}
        </ScrollView>

        {/* Comment List Screen */}
        <CommentListSheet
          ref={actionsheetRef}
          postId={postArray[currentItemIndex]?.postData?._id}
          commentCount={postArray[currentItemIndex]?.comment}
          onCommentAdded={() => {
            let temp = postArray || [];
            Object.assign(temp[currentItemIndex], {
              comment: temp[currentItemIndex]?.comment + 1,
            });
            setPostArray([...temp]);
          }}
          onCommentDelete={id => {
            setTimeout(() => {
              deleteCommentRef.current?.show(id);
            }, 800);
          }}
        />

        <DeleteCommentSheet
          ref={deleteCommentRef}
          onDelete={() => {
            let temp = postArray || [];
            if (temp[currentItemIndex]?.comment > 0) {
              Object.assign(temp[currentItemIndex], {
                comment: temp[currentItemIndex]?.comment - 1,
              });
              setPostArray([...temp]);
            }
          }}
        />

        <ShareSheet ref={shareSheetRef} data={postArray[currentItemIndex]} />
        <ReportActionSheet
          ref={menuSheetRef}
          postId={postArray[currentItemIndex]?.postData?._id}
          userId={postArray[currentItemIndex]?.postData?.user_id?._id}
          loggedInUserId={userInfo?.id}
          onActionClick={(userId, postId, type) =>
            reportOptionSheet?.current?.show(userId, postId, type)
          }
        />
        <ReportTypeOptionSheet
          ref={reportOptionSheet}
          onActionDone={onRefresh}
        />

        <FollowUserSheet
          ref={followingUserRef}

          // User props
          userDetail={
            postArray[currentItemIndex]?.postData?.added_from === '1'
              ? postArray[currentItemIndex]?.postData?.user_id
              : null
          }
          isFollowing={postArray[currentItemIndex]?.isFollowed}
          onFollowed={() => {
            let temp = [...postArray];
            let userId = postArray[currentItemIndex]?.postData?.user_id?._id;
            temp?.forEach(item => {
              if (item?.postData?.user_id?._id === userId) {
                item.isFollowed = true;
              }
            });
            setPostArray(temp);
          }}
          onUnfollowed={() => {
            let temp = [...postArray];
            let userId = postArray[currentItemIndex]?.postData?.user_id?._id;
            temp?.forEach(item => {
              if (item?.postData?.user_id?._id === userId) {
                item.isFollowed = false;
              }
            });
            setPostArray(temp);
          }}

          // Business props
          businessDetail={
            postArray[currentItemIndex]?.postData?.added_from === '2' &&
              postArray[currentItemIndex]?.postData?.tagBussiness?.[0]
              ? postArray[currentItemIndex]?.postData?.tagBussiness?.[0]
              : null
          }
          isBusinessFollowing={
            postArray[currentItemIndex]?.postData?.tagBussiness?.[0]
              ?.isFollowedBusiness
          }
          onBusinessFollowed={() => {
            let temp = [...postArray];
            let businessId = postArray[currentItemIndex]?.postData?.tagBussiness?.[0]?._id;
            temp?.forEach(item => {
              if (
                item?.postData?.tagBussiness?.[0]?._id === businessId
              ) {
                item.postData.tagBussiness[0].isFollowedBusiness = true;
              }
            });
            setPostArray(temp);
          }}
          onBusinessUnfollowed={() => {
            let temp = [...postArray];
            let businessId = postArray[currentItemIndex]?.postData?.tagBussiness?.[0]?._id;
            temp?.forEach(item => {
              if (
                item?.postData?.tagBussiness?.[0]?._id === businessId
              ) {
                item.postData.tagBussiness[0].isFollowedBusiness = false;
              }
            });
            setPostArray(temp);
          }}
        />
      </View>
      <NoInternetModal shouldShow={!isInternetConnected} />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // height: HEIGHT,
    backgroundColor: colors.gray,
  },
storyContainer:{ zIndex: 3, marginLeft: 10, position: 'absolute', top: Platform.OS === 'android' ? '10%' : '17%', flexDirection:'row' },
profilesty:{
  width: 69,
  height: 69,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: colors.gray,
  alignItems: 'center',
  justifyContent: 'center'
},
profileImg:{ width: 60, height:60, borderRadius: 50 },
plusicon:{
  position: 'absolute',
  bottom: -2,
  right: -2,
  backgroundColor: colors.primaryColor, // Instagram blue
  width: 20,
  height: 20,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center'
},
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  iconsty: {
    width: wp(20),
    height: wp(20)
  }
});

export default HomeScreen;

