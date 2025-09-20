import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Touchable,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import NotificationSearchHeader from '../../../components/NotificationSearchHeader';
import {getAllBusinessCategoryRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';
import BackHeader from '../../../components/BackHeader';
import {useIsFocused} from '@react-navigation/native';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';
const BusinessListingScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
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

  const getCategories = () => {
    setIsLoading(true);
    getAllBusinessCategoryRequest()
      .then(res => {
        setAllCategories(res?.result);
      })
      .catch(err => {
        Toast.error('Business Categories', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isFocused) {
      getCategories();
    }
  }, [isFocused]);

  return (
    <>
      <CustomContainer>
        {route?.params?.shouldGoBack ? (
          <BackHeader />
        ) : (
          <NotificationSearchHeader isBusiness={true} />
        )}

        <View
          style={{
            alignItems: 'center',
            marginVertical: wp(20),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(18),
              color: colors.black,
            }}>
            Select the Business Listing
          </Text>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(18),
              color: colors.primaryColor,
            }}>
            you want to explore.
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <FlatList
            data={allCategories}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SubBusinessCategory', {
                      id: item?._id,
                      addBusiness: route?.params?.addBusiness || false,
                    })
                  }
                  style={{
                    margin: wp(5),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{uri: item?.icon}}
                    style={{
                      height: WIDTH / 3.8,
                      width: WIDTH / 3.8,
                      resizeMode: 'stretch',
                      borderRadius: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(13),
                      color: colors.black,
                      width: WIDTH / 3.4,
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {item?.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            numColumns={3}
          />
        </View>
        {/* <View style={{height: wp(80)}} /> */}
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default BusinessListingScreen;
