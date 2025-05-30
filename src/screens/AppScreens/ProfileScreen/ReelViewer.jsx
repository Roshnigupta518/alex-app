import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList, Platform, Text} from 'react-native';
import {colors, HEIGHT, wp} from '../../../constants';
import ReelCard from '../../../components/ReelComponent/ReelCard';
import {useIsFocused} from '@react-navigation/native';
import CommentListSheet from '../../../components/ActionSheetComponent/CommentListSheet';
import BackHeader from '../../../components/BackHeader';
import DeleteCommentSheet from '../../../components/ActionSheetComponent/DeleteCommentSheet';
import ShareSheet from '../../../components/ActionSheetComponent/ShareSheet';
import ReportActionSheet from '../../../components/ActionSheetComponent/ReportActionSheet';
import ReportTypeOptionSheet from '../../../components/ActionSheetComponent/ReportTypeOptionSheet';
import FollowUserSheet from '../../../components/ActionSheetComponent/FollowUserSheet';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import crashlytics from '@react-native-firebase/crashlytics';

const ReelViewer = ({navigation, route}) => {
 
  const flashListRef = useRef();
  const deleteCommentRef = useRef();
  const shareSheetRef = useRef();
  const menuSheetRef = useRef();
  const followingUserRef = useRef();
  const reportOptionSheet = useRef();
  const isFocused = useIsFocused();
  const actionsheetRef = useRef();
  const [isOnFocusItem, setIsOnFocusItem] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [postArray, setPostArray] = useState(route?.params?.data || []);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
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

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems[0]) {
      setCurrentItemIndex(viewableItems[0]?.index);
    }
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  useEffect(() => {
    if (isFocused && flashListRef.current && postArray.length > 0) {
      setTimeout(() => {
        // flashListRef.current.scrollToIndex({
        //   index: route?.params?.currentIndex || 0,
        //   animated: false,
        // });
      }, 500); // Adjust timeout as needed
    }
  }, [isFocused, postArray.length]);

  const _renderReels = useCallback(
    ({item, index}) => {
      console.log({index, HEIGHT})
      return (
        <View style={styles.cardContainer}>
          <ReelCard
            idx={index}
            screen={'Reel'}
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
            screenHeight={HEIGHT}
          />
        </View>
      );
    },
    [currentItemIndex, isOnFocusItem, postArray],
  );

  const handleScrollToIndexFailed = React.useCallback(info => {
    if (flashListRef.current) {
      // flashListRef.current.scrollToOffset({
      //   offset: info.averageItemLength * info.index,
      //   animated: false,
      // });
    }
  }, []);
  // const getItemLayout = (data, index) => ({
  //   length: HEIGHT, // Replace with your item height
  //   offset: HEIGHT * index,
  //   index,
  // });

  const getItemLayout = (data, index) => {
    const ITEM_HEIGHT = Math.round(HEIGHT);
    console.log({ITEM_HEIGHT})
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    };
  };

  
  return (
    <>
      <View 
      style={styles.container}
      >
        <View
          style={{
            position: 'absolute',
            marginVertical: Platform.OS == 'ios' ? wp(40) : wp(10),
            zIndex: 3,
          }}>
          <BackHeader />
        </View>
      
        <FlatList
          ref={flashListRef}
          data={postArray}
          renderItem={_renderReels}
          keyExtractor={item => item.id} // Ensure you have a unique key for each item
          showsVerticalScrollIndicator={false}
          initialScrollIndex={route?.params?.currentIndex || 0}
          disableIntervalMomentum
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewabilityConfig}
          // estimatedItemSize={2}
          pagingEnabled
          snapToInterval={Math.round(HEIGHT)}
          initialNumToRender={5}
          windowSize={10}
          removeClippedSubviews={false}
          // getItemLayout={getItemLayout}
          getItemLayout={(data, index) => ({
            length: Math.round(HEIGHT),
            offset: Math.round(HEIGHT) * index,
            index
          })}
          contentInset={{top: 0, bottom: 0, left: 0, right: 0}}
          contentInsetAdjustmentBehavior="automatic"
          // contentContainerStyle={{alignSelf: 'center'}}
          // extraData={HEIGHT}
          extraData={Math.round(HEIGHT)}
          contentContainerStyle={{ padding: 0, margin: 0 }}

        />
     
        {/* comment actionsheets */}
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

        <ShareSheet ref={shareSheetRef} />
        <ReportActionSheet
          ref={menuSheetRef}
          postId={postArray[currentItemIndex]?.postData?._id}
          userId={postArray[currentItemIndex]?.postData?.user_id?._id}
          onActionClick={(userId, postId, type) =>
            reportOptionSheet?.current?.show(userId, postId, type)
          }
        />
        <ReportTypeOptionSheet ref={reportOptionSheet} />
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
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: Math.round(HEIGHT),
    backgroundColor: colors.black,
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default ReelViewer;
