import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import SearchInput from '../../../components/SearchInput';
import {getSubExploreCategoryRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import NotFoundAnime from '../../../components/NotFoundAnime';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import ReadMore from '@fawazahmed/react-native-read-more';
const PopularCategoryScreen = ({navigation, route}) => {
  const [searchTxt, setSearchTxt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [exploreList, setExploreList] = useState([]);
  const [searchedExploreList, setSearchedExploreList] = useState([]);
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
    getSubExploreCategoryRequest(route?.params?.id)
      .then(res => {
        setExploreList(res?.result?.subExplore_id);
        setSearchedExploreList(res?.result?.subExplore_id);
      })
      .catch(err => {
        Toast.error('Explore', err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getExploreList();
  }, []);

  const searchExplore = txt => {
    let searchRes = exploreList.filter(item => item?.title?.includes(txt));
    setSearchedExploreList(txt?.length < 1 ? [...exploreList] : [...searchRes]);
  };

  const _renderExploreList = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ExploreDetailScreen', {data: item})}
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

            {item?.address?.length > 0 && item?.address != undefined && (
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
                  {item?.address[0]}
                </Text>
              </View>
            )}
          </View>
        </View>
        <ImageBackground
          source={{
            uri: item?.explorelBanner,
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
            <ReadMore
              numberOfLines={4}
              style={{
                fontFamily: fonts.regular,
                fontSize: wp(12),
                color: colors.white,
              }}
              seeMoreStyle={{color: colors.primaryColor}}
              seeLessStyle={{color: colors.primaryColor, marginTop: wp(1)}}>
              {item?.description}
            </ReadMore>
            {/* <Text
              numberOfLines={3}
              style={{
                fontFamily: fonts.regular,
                fontSize: wp(12),
                color: colors.white,
              }}>
              {item?.description}
            </Text> */}
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
        }}>
        <View
          style={{
            //   padding: wp(20),
            flex: 1,
          }}>
          <View>
            <BackHeader label={route?.params?.title} />
          </View>

          <View
            style={{
              marginVertical: wp(20),
              paddingHorizontal: wp(15),
            }}>
            <SearchInput
              value={searchTxt}
              onChangeText={txt => {
                searchExplore(txt);
                setSearchTxt(txt);
              }}
            />
          </View>

          <View style={{flex: 1}}>
            <FlatList
              data={searchedExploreList}
              ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
              contentContainerStyle={{alignSelf: 'center'}}
              renderItem={_renderExploreList}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default PopularCategoryScreen;
