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
import { useSelector } from 'react-redux';
import NotFoundAnime from '../../../components/NotFoundAnime';

const ReelViewer = ({route}) => {

  const screenHeight = Platform.OS == 'ios' ? HEIGHT : HEIGHT -30
 
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
  const userInfo = useSelector(state => state.UserInfoSlice.data);

  const { params } = route;
  const onDeletePost = params?.onDeletePost;
  const currentIndex = params?.currentIndex;

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
        flashListRef.current.scrollToIndex({
          index: currentIndex,
          animated: false,
          viewPosition: 0,
        });
      }); // Adjust timeout as needed
    }
  }, [isFocused, postArray.length, currentIndex]);

  const handleDeletePost = () => {
    if (postArray.length === 0) return;

    const deletedId = postArray[currentItemIndex]?.postData?._id;

      if (onDeletePost) {
        onDeletePost(deletedId); // Inform ProfileDetail to remove the post
      }
  
    const updatedArray = [...postArray];
    updatedArray.splice(currentItemIndex, 1); // Safely remove current item
  
    // Avoid crashing due to invalid index
    const newIndex = Math.max(currentItemIndex - 1, 0);
  
    setPostArray(updatedArray);
    setCurrentItemIndex(newIndex);
  };  

  const _renderReels = useCallback(
    ({item, index}) => {
      // console.log({index, HEIGHT})
      return (
        <View style={[styles.cardContainer,{height:screenHeight}]}>
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
            screenHeight={screenHeight}
          />
        </View>
      );
    },
    [currentItemIndex, isOnFocusItem, postArray],
  );

  const ListEmptyComponent = () => {
    return(
      <NotFoundAnime />
    )
  }
  
  return (
    <>
      <View 
      style={styles.container}>
        <View
          style={{
            position: 'absolute',
            top: Platform.OS == 'ios' ? wp(40) : wp(10),
            zIndex: 3,
          }}>
          <BackHeader />
        </View>

            <View
              style={{
                alignItems: 'center',
                height: screenHeight,
                justifyContent: 'center',
              }}>   
        <FlatList
          ref={flashListRef}
          data={postArray}
          renderItem={_renderReels}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          disableIntervalMomentum
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewabilityConfig}
          pagingEnabled
          snapToInterval={Math.round(screenHeight)}
          initialNumToRender={5}
          windowSize={10}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => ({
            length: Math.round(screenHeight),
            offset: Math.round(screenHeight) * index,
            index
          })}
          contentInset={{top: 0, bottom: 0, left: 0, right: 0}}
          contentInsetAdjustmentBehavior="automatic"
          extraData={Math.round(screenHeight)}
          contentContainerStyle={{ padding: 0, margin: 0 }}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
        {/* comment actionsheets */}
        {postArray[currentItemIndex] && (
         <>
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
          loggedInUserId={userInfo?.id}
          onActionClick={(userId, postId, type) =>
            reportOptionSheet?.current?.show(userId, postId, type)
          }
        />
        <ReportTypeOptionSheet ref={reportOptionSheet}
        onActionDone={handleDeletePost}
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
         </>
       )}
      </View>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // height: Math.round(HEIGHT),
    backgroundColor: colors.black,
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});

export default ReelViewer;
