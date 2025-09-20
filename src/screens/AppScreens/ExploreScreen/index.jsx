import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import SearchInput from '../../../components/SearchInput';
import {getExploreCategoriesRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';
import {useIsFocused} from '@react-navigation/native';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';

const ExploreScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 15,
    totalRecords: 15,
    isPaginationLoading: true,
  });

  const [exploreList, setExploreList] = useState([]);
  const [searchExploreList, setSearchExploreList] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('stateinternet=-=', JSON.stringify(state));
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
  const getExploreList = (data, init) => {
    setIsLoading(true);
    getExploreCategoriesRequest(data)
      .then(res => {
        if (init) {
          setExploreList([...res?.result]);
          setSearchExploreList([...res?.result]);
        } else {
          setExploreList([...exploreList, ...res?.result]);
          setSearchExploreList([...exploreList, ...res?.result]);
        }
        pagination.totalRecords = res?.totalRecords;
      })
      .catch(err => {
        Toast.error('Explore', err?.message);
      })
      .finally(() => {
        pagination.isPaginationLoading = false;
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isFocused) {
      setExploreList([]);
      setSearchExploreList([]);

      pagination.skip = 0;
      pagination.limit = 15;
      pagination.totalRecords = 15;
      pagination.isPaginationLoading = true;
      getExploreList(
        {
          skip: pagination.skip,
          limit: pagination.limit,
        },
        true,
      );
    }
  }, [isFocused]);

  const searchExplore = txt => {
    let searchRes = exploreList.filter(item =>
      item?.exploreTitle?.includes(txt),
    );
    setSearchExploreList(txt?.length < 1 ? [...exploreList] : [...searchRes]);
  };

  const _renderExploreList = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('PopularCategoryScreen', {
            id: item?._id,
            title: item?.exploreTitle,
          })
        }
        style={{
          margin: wp(3),
        }}>
        <ImageBackground
          source={{
            uri: item?.explorelBanner,
          }}
          style={{
            height: wp(140),
            width: WIDTH / 3.3,
            justifyContent: 'flex-end',
          }}
          imageStyle={{
            borderRadius: wp(10),
          }}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderBottomLeftRadius: wp(10),
              borderBottomRightRadius: wp(10),
              padding: wp(12),
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: wp(13),
                color: colors.white,
              }}
              numberOfLines={3}>
              {item?.exploreTitle}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <CustomContainer>
        <View
          style={{
            padding: wp(10),
            flex: 1,
          }}>
          <View>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: wp(20),
                color: colors.black,
              }}>
              Explore
            </Text>
          </View>

          <View
            style={{
              marginVertical: wp(20),
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
              data={searchExploreList}
              // contentContainerStyle={{alignSelf: 'center'}}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={_renderExploreList}
              numColumns={3}
              ListFooterComponent={<View style={{height: 150}} />}
              ListEmptyComponent={
                <NotFoundAnime
                  isLoading={isLoading && searchExploreList?.length == 0}
                />
              }
              onEndReached={() => {
                if (
                  pagination?.skip < pagination.totalRecords &&
                  !pagination.isPaginationLoading
                ) {
                  pagination.isPaginationLoading = true;
                  pagination.skip += pagination.limit;
                  getExploreList({
                    skip: pagination.skip,
                    limit: pagination.limit,
                  });
                }
              }}
            />
          </View>
        </View>
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default ExploreScreen;
