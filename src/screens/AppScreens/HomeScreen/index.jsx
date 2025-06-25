import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  Text, Platform, PermissionsAndroid, AppState, ScrollView, Linking
} from 'react-native';
import { colors, fonts, HEIGHT, wp } from '../../../constants';
import ReelHeader from '../../../components/ReelComponent/ReelHeader';
import ReelCard from '../../../components/ReelComponent/ReelCard';
import { useIsFocused } from '@react-navigation/native';
import CommentListSheet from '../../../components/ActionSheetComponent/CommentListSheet';
import { GetAllPostsRequest } from '../../../services/Utills';
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
  const screenHeight = Platform .OS == 'ios' ? HEIGHT : HEIGHT

  console.log({tabBarHeight, screenHeight})

  const prevNearBy = useRef(nearByType);
  const flashListRef = useRef();
  const deleteCommentRef = useRef();
  const isFocused = useIsFocused();
  const actionsheetRef = useRef();
  const followingUserRef = useRef();
  const shareSheetRef = useRef();
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

  // const { city, location, error } = useLocation()
  const { location, city, error, permissionGranted, refreshLocation } = useLocation();

  console.log({ location, city, error, permissionGranted })

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
  const onRefresh = React.useCallback(async() => {
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
    console.log({ selectedCityData, paramsValues, currentCity: city });
  
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
        setPostArray(prevPosts => [...prevPosts, ...res?.result]);
  
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
  

  const _onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentItemIndex(viewableItems[0]?.index);
      dispatch(ReelIndexAction(viewableItems[0]?.index));
      if (
        pagination.skip < pagination.totalRecords &&
        postArray?.length - 2 <= viewableItems[0]?.index &&
        !pagination.isLoading
      ) {
        pagination.skip += pagination.limit;
        getAllPosts();
      }
    }
  };

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

  // useEffect(() => {
  //   if (!isFocused) {
  //     setIsOnFocusItem(false);
  //   } else {
  //     if (
  //       route?.params?.shouldScrollTopReel ||
  //       prevNearBy.current !== nearByType
  //     ) {
  //       setPostArray([]);
  //        console.log('calling when refresh the page')
  //       onRefresh();
  //     } else if (postArray?.length == 0) {
  //       console.log('isfouces');
  //       if (city) {
  //         getAllPosts();
  //       }
  //       if (error) {
  //         setIsLoading(false)
  //       }
  //     }
  //     setIsOnFocusItem(true);
  //   }
  // }, [isFocused, city, selectedCityData, error]);

  useEffect(() => {
    setIsLoading(true)
    if (!isFocused) {
      setIsOnFocusItem(false);
    } else {
      if ((error || !city) && selectedCityData?.locationType == 'current') {
        console.log('Skipping location-based logic because of error or missing city.');
        setIsLoading(false);
        return;
      }
      if (route?.params?.shouldScrollTopReel || prevNearBy.current !== nearByType) {
        setPostArray([]);
        onRefresh();
      } else if (postArray?.length === 0) {
        getAllPosts();
      }
      setIsOnFocusItem(true);
    }
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

  // useEffect(() => {
  //   if (reelIndex == 0 && postArray?.length > 0) {
  //     flashListRef.current.scrollToOffset({ animated: true, offset: 0 });
  //   }
  // }, [reelIndex]);

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
                initialScrollIndex={0}
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
          ) : shouldShowEmptyMessage ? (
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
          userDetail={postArray[currentItemIndex]?.postData?.user_id}
          isFollowing={postArray[currentItemIndex]?.isFollowed}
          onFollowed={() => {
            let temp = [...postArray] || [];
            let userId = postArray[currentItemIndex]?.postData?.user_id?._id;

            temp?.forEach(item => {
              if (item?.postData?.user_id?._id == userId) {
                Object.assign(item, {
                  isFollowed: true,
                });
              }
            });
            setPostArray([...temp]);
          }}
          onUnfollowed={() => {
            let temp = [...postArray] || [];
            let userId = postArray[currentItemIndex]?.postData?.user_id?._id;

            temp?.forEach(item => {
              if (item?.postData?.user_id?._id == userId) {
                Object.assign(item, {
                  isFollowed: false,
                });
              }
            });
            setPostArray([...temp]);
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

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default HomeScreen;
