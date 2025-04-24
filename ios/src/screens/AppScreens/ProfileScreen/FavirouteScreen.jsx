import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {colors, fonts, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import Toast from '../../../constants/Toast';
import ImageConstants from '../../../constants/ImageConstants';
import {getFavirouteExploreRequest} from '../../../services/Utills';
import NotFoundAnime from '../../../components/NotFoundAnime';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const FavouriteScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exploreList, setExploreList] = useState([]);
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

  const getExploreList = () => {
    setIsLoading(true);
    getFavirouteExploreRequest()
      .then(res => {
        setExploreList(res?.result);
      })
      .catch(err => {
        Toast.error('FaFavourite', err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getExploreList();
  }, []);

  const _renderExploreList = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('ExploreDetailScreen', {
            data: item?.explore_category_id,
            alreadyFaviroute: true,
          })
        }
        style={{
          margin: wp(5),
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
            shadowColor: colors.black,
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 1,
            shadowRadius: 20,
            borderColor: '#DADBDD',
            borderWidth: 0.5,
          }}>
          <Image
            source={{uri: item?.explore_category_id?.logo}}
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
              {item?.explore_category_id?.title}
            </Text>

            {item?.explore_category_id?.address?.length > 0 &&
              item?.explore_category_id?.address != undefined && (
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
                    {item?.explore_category_id?.address[0]}
                  </Text>
                </View>
              )}
          </View>
        </View>
        <ImageBackground
          source={{
            uri: item?.explore_category_id?.explorelBanner,
          }}
          style={{
            height: wp(160),
            width: WIDTH / 1.23,
            justifyContent: 'flex-end',
          }}
          imageStyle={{
            borderBottomLeftRadius: wp(10),
            borderBottomRightRadius: wp(10),
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
              {item?.explore_category_id?.description}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Favorites" />

        <View
          style={{
            flex: 1,
            marginTop: wp(20),
          }}>
          <FlatList
            data={exploreList || []}
            contentContainerStyle={{alignSelf: 'center'}}
            renderItem={_renderExploreList}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
          />
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default FavouriteScreen;
