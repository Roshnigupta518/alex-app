import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {colors, fonts, HEIGHT, wp} from '../../../constants';
import SearchInput from '../../../components/SearchInput';
import ImageConstants from '../../../constants/ImageConstants';
import {GetTrendingCitiesRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import {useDispatch} from 'react-redux';
import {nearByAction} from '../../../redux/Slices/NearBySlice';
import Geolocation from '@react-native-community/geolocation';
import MilesListSheet from '../../../components/ActionSheetComponent/MilesListSheet';
import NotFoundAnime from '../../../components/NotFoundAnime';
import { setCityAction } from '../../../redux/Slices/SelectedCitySlice';

const NearByScreen = ({navigation}) => {
  const mileListRef = useRef();
  const dispatch = useDispatch();
  const [searchTxt, setSearchTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const staticOptions = [
    {
      icon: ImageConstants.location,
      label: 'Near By',
      action: () => mileListRef?.current?.show(),
    },
    {
      icon: ImageConstants.globe,
      label: 'Global',
      action: () => {
        cityDataUpdated()
        dispatch(
          nearByAction({
            location_title: 'Global',
            location_type: 'global',
            location_coordinates: null,
            location_distance: null,
            city: null,
          }),
        );
        navigation.navigate('HomeScreen', {shouldScrollTopReel: true});
      },
    },
  ];

  const [allCities, setAllCities] = useState([]);
  const [searchedCities, setSearchedCities] = useState([]);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const getLocation = () => {
    try {
      Geolocation.getCurrentPosition(info => {
        setCoordinates({
          latitude: info?.coords?.latitude,
          longitude: info?.coords?.longitude,
        });
      });
    } catch (err) {
      console.log('err:', err);
    }
  };

  const getCities = () => {
    setIsLoading(true);
    GetTrendingCitiesRequest()
      .then(res => {
        setAllCities(res?.result || []);
        setSearchedCities(res?.result || []);
      })
      .catch(err => {
        Toast.error('Cities', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const _renderFirstList = ({item, index}) => {
    return (
      <View style={styles.firstListView}>
        <View style={styles.firstRowBorderLine} />
        <TouchableOpacity
          onPress={item?.action}
          style={styles.firstRowItemStyle}>
          <Image source={item?.icon} style={styles.imageIconStyle} />
          <Text style={styles.itemLabelStyle}>{item?.label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const cityDataUpdated = () => {
    dispatch(setCityAction({
      city:'other'
    }))
  }

  const _renderCityList = ({item, index}) => {
    return (
      <View style={styles.cityViewStyle}>
        <View style={styles.firstRowBorderLine} />
        <TouchableOpacity
          onPress={() => {
            dispatch(
              nearByAction({
                location_title: item?._id,
                location_type: 'city',
                location_coordinates: null,
                location_distance: null,
                city: item?._id,
              }),
            );
            cityDataUpdated()
            navigation.navigate('HomeScreen', {shouldScrollTopReel: true});
          }}
          style={styles.firstRowItemStyle}>
          <Image
            source={ImageConstants.location}
            style={{
              height: wp(30),
              width: wp(30),
              resizeMode: 'contain',
              tintColor: colors.black,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: wp(18),
              color: colors.black,
              marginLeft: 20,
            }}>
            {item?._id}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CityRenderView = () => {
    return (
      <View
        style={{
          backgroundColor: colors.lightBlack,
          padding: wp(10),
          marginVertical: 30,
        }}>
        <Text
          style={{
            fontFamily: fonts.semiBold,
            fontSize: wp(16),
            color: colors.white,
          }}>
          Trending Cities
        </Text>
      </View>
    );
  };

  const StaticListRenderingWithTitle = () => {
    return (
      <FlatList
        data={staticOptions}
        contentContainerStyle={{
          marginTop: wp(30),
        }}
        renderItem={_renderFirstList}
        ListFooterComponent={<CityRenderView />}
      />
    );
  };

  const searchCityKeyword = txt => {
    let searchedArr = allCities?.filter(item => item?._id?.includes(txt));
    setSearchedCities(txt?.length >= 1 ? [...searchedArr] : [...allCities]);
  };

  useEffect(() => {
    getLocation();
    getCities();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subViewContainer}>
        <View style={styles.searchView}>
          <SearchInput
            containerStyle={styles.inputStyle}
            value={searchTxt}
            onChangeText={txt => {
              setSearchTxt(txt);
              searchCityKeyword(txt);
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButtonStyle}>
            <Text style={styles.cancelTxtStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.parentListView}>
          <FlatList
            data={searchedCities}
            contentContainerStyle={{
              marginTop: wp(30),
            }}
            renderItem={_renderCityList}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            ListHeaderComponent={<StaticListRenderingWithTitle />}
            ListFooterComponent={<View style={{height: 100}} />}
          />
        </View>
      </View>
      <MilesListSheet
        ref={mileListRef}
        onMileSelect={miles => {
          dispatch(
            nearByAction({
              location_title: `Near me ${miles} miles`,
              location_type: 'nearme',
              location_coordinates: coordinates,
              location_distance: Number(miles),
              city: null,
            }),
          );
          cityDataUpdated()
          navigation.navigate('HomeScreen', {shouldScrollTopReel: true});
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  subViewContainer: {
    flex: 1,
  },

  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS == 'android' ? wp(20) : 0,
    marginHorizontal: 10,
  },

  inputStyle: {
    flex: 1,
  },

  cancelButtonStyle: {
    marginLeft: wp(10),
  },

  cancelTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(15),
    color: colors.black,
  },

  parentListView: {
    flex: 1,
  },

  firstListView: {
    marginHorizontal: wp(20),
  },

  firstRowBorderLine: {
    height: 2,
    backgroundColor: colors.gray,
  },

  firstRowItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(20),
  },

  imageIconStyle: {
    height: wp(30),
    width: wp(30),
    resizeMode: 'contain',
    tintColor: colors.black,
  },

  itemLabelStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(18),
    color: colors.black,
    marginLeft: 20,
  },

  cityViewStyle: {
    marginHorizontal: wp(20),
  },
});

export default NearByScreen;
