import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground, ActivityIndicator
} from 'react-native';
import BusinessHeader from '../commonComponents/BusinessHeader';
import SearchInput from '../../../components/SearchInput';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import {
  DeleteEventRequest,
  GetMyEventListRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';
const EventUserListingScreen = ({navigation}) => {
  const swipeRef = useRef();
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [eventSearchList, setEventSearchList] = useState([]);
  const [searchTxt, setSearchTxt] = useState('');
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

  const getEventList = () => {
    try {
      GetMyEventListRequest()
        .then(res => {
          let data = res?.result?.filter(item => item?.user_id == userInfo?.id);
          setEventList(data || []);
          setEventSearchList(data || []);
          swipeRef?.current?.manuallyOpenAllRows(0);
        })
        .catch(err => {
          Toast.error('Event', err?.message);
        })
        .finally(() => setIsLoading(false));
    } catch (err) {
      Toast.error('Event', 'Something went wrong!');
      setIsLoading(false);
    }
  };

  const searchEvent = txt => {
    let search_res = eventList?.filter(item => item?.title?.includes(txt));
    setEventSearchList(txt?.length < 1 ? [...eventList] : [...search_res]);
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      setTimeout(() => {
        getEventList();
      }, 800);
    }
  }, [isFocused]);

  const EmptyView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          height: HEIGHT / 2,
          justifyContent: 'center',
        }}>
         {isLoading ? (
        <ActivityIndicator size={'large'} color={colors.primaryColor} />
         ):
          <View style={{ alignItems: 'center',}}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: wp(16),
            color: colors.black,
          }}>
          No Events has been listed!
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddEventScreen')}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(16),
              color: colors.primaryColor,
              marginTop: 10,
            }}>
            Add Your Event
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginTop: wp(40),
          }}>
          <Image
            source={ImageConstants.not_found}
            style={{
              height: wp(140),
              width: wp(140),
              tintColor: colors.primaryColor,
              resizeMode: 'contain',
            }}
          />
        </View>
           </View>
          }
      </View>
    );
  
  };
  const _renderEventList = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('EventDetailScreen', {data: item})}
        style={{
          margin: wp(5),
          shadowColor: colors.black,
          shadowOffset: {width: 1, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 30,
          borderRadius: 10,
          borderWidth: 0.4,
          borderColor: '#DADBDD',
          borderBottomLeftRadius: wp(10),
          borderBottomRightRadius: wp(10),
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: wp(15),
            paddingHorizontal: wp(14),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: item?.logo}}
            style={{
              height: wp(30),
              width: wp(30),
              borderRadius: 100,
            }}
          />

          <View
            style={{
              marginLeft: 10,
              flex: 1,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.medium,
                fontSize: wp(14),
                color: colors.black,
              }}>
              {item?.title}
            </Text>

            {item?.location?.length > 0 && item?.location != undefined && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 3,
                }}>
                <Image
                  source={ImageConstants.blue_location}
                  style={{
                    height: wp(20),
                    width: wp(20),
                    tintColor: colors.primaryColor,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: wp(11),
                    color: colors.primaryColor,
                    width: WIDTH / 1.8,
                    marginLeft: 5,
                  }}>
                  {item?.location}
                </Text>
              </View>
            )}
          </View>
        </View>
        <ImageBackground
          source={{
            uri: item?.image?.length > 0 ? item?.image[0] : '',
          }}
          style={{
            height: wp(160),
            justifyContent: 'flex-end',
            backgroundColor: colors.white,
          }}
          imageStyle={{
            borderRadius: wp(10),
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderBottomLeftRadius: wp(10),
              borderBottomRightRadius: wp(10),
              padding: wp(10),
            }}>
            <Text
              numberOfLines={3}
              style={{
                fontFamily: fonts.regular,
                fontSize: wp(12),
                color: colors.white,
              }}>
              {item?.description}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <CustomContainer>
        <BusinessHeader
          label="Event Listing"
          onAction={() => navigation.navigate('AddEventScreen')}
        />

        <View
          style={{
            margin: wp(20),
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              searchEvent(txt);
              setSearchTxt(txt);
            }}
          />
        </View>

        <View style={{ flex: 1, padding: wp(15) }}>
  {isLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primaryColor} />
    </View>
  ) : (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={eventSearchList}
      renderItem={_renderEventList}
      ListEmptyComponent={<EmptyView />}
      ListFooterComponent={<View style={{ height: 100 }} />}
    />
  )}
</View>

      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default EventUserListingScreen;
