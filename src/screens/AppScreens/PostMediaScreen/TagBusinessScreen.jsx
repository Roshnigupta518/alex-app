import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {
  getAllBusinessListRequest,
  getGoogleBusinessesRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import ImageConstants from '../../../constants/ImageConstants';
import CustomButton from '../../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import {tagBusinessAction} from '../../../redux/Slices/TagBusinessSlice';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';

const TagBusinessScreen = ({navigation}) => {
  const tagBusinessList = useSelector(state => state.tagBusinessSlice?.data);
  const dispatch = useDispatch();
  const [allBusiness, setAllBusiness] = useState([]);
  const [searchedBusiness, setSearchBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchTxt, setSearchTxt] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: '',
  });
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

  const getAllBusiness = async () => {
    getAllBusinessListRequest()
      .then(res => {
        setAllBusiness([...res?.result]);
        setSearchBusiness([...res?.result]);
      })
      .catch(err => {
        Toast.error('Users', err?.message);
      });
  };

  const getGoogleBusiness = txt => {
    getGoogleBusinessesRequest(coordinates.latitude, coordinates.longitude, txt)
      .then(res => {
        setAllBusiness(res?.results);
        setSearchBusiness(res?.results);
      })
      .catch(err => {
        console.log('see here: ', err);
      });
  };

  // Debounce the API call function
  const debouncedApiCall = _.debounce(txt => {
    getGoogleBusiness(txt);
  }, 1000);

  const handleInputChange = txt => {
    setSearchTxt(txt);
    setSelectedBusiness(null);
    if (txt?.length < 2) {
      getAllBusiness();
    } else {
      debouncedApiCall(txt);
    }
  };

  useEffect(() => {
    getLocation();
    getAllBusiness();
  }, []);

  return (
    <>
      <CustomContainer>
        <BackHeader />

        <View
          style={{
            flex: 1,
            margin: wp(20),
          }}>
          <SearchInput value={searchTxt} onChangeText={handleInputChange} />

          <View
            style={{
              flex: 1,
              marginTop: wp(30),
            }}>
            {/* <FlatList
              data={searchedBusiness}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedBusiness(
                        (selectedBusiness?._id &&
                          selectedBusiness?._id == item?._id) ||
                          (selectedBusiness?.place_id &&
                            selectedBusiness?.place_id == item?.place_id)
                          ? null
                          : item,
                      )
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.white,
                      shadowColor: colors.black,
                      shadowOffset: {width: 1, height: 1},
                      shadowOpacity: 0.1,
                      shadowRadius: 30,
                      elevation: 3,
                      marginVertical: wp(5),
                      marginHorizontal: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 6,
                          minHeight: wp(60),
                          backgroundColor: colors.primaryColor,
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                          paddingVertical: 10,
                        }}
                      />

                      <View>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontFamily: fonts.semiBold,
                            fontSize: wp(16),
                            color: colors.black,
                            width: WIDTH / 1.7,
                            marginLeft: 10,
                          }}>
                          {item?.name}
                        </Text>
                        <Text
                          numberOfLines={3}
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: wp(10),
                            color: colors.black,
                            width: WIDTH / 1.7,
                            marginLeft: 10,
                          }}>
                          {item?.address || item?.formatted_address}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        marginRight: wp(10),
                      }}>
                      {(selectedBusiness?._id &&
                        selectedBusiness?._id == item?._id) ||
                      (selectedBusiness?.place_id &&
                        selectedBusiness?.place_id == item?.place_id) ? (
                        <Image
                          source={ImageConstants.check_round}
                          style={{
                            height: wp(25),
                            width: wp(25),
                            resizeMode: 'contain',
                            tintColor: colors.primaryColor,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            borderWidth: 2,
                            borderColor: colors.primaryColor,
                            padding: 10,
                            borderRadius: 30,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            /> */}

<FlatList
  data={searchedBusiness}
  keyExtractor={(item, index) => item?._id || item?.place_id || index.toString()}
  renderItem={({item}) => {
    const isSelected =
      (selectedBusiness?._id && selectedBusiness?._id === item?._id) ||
      (selectedBusiness?.place_id && selectedBusiness?.place_id === item?.place_id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedBusiness(isSelected ? null : item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderRadius: 10,
          marginVertical: wp(6),
          // marginHorizontal: wp(12),
          // paddingVertical: wp(12),
          // paddingHorizontal: wp(14),
          shadowColor: colors.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          // elevation: 3,
          borderWidth:1,
          borderColor:colors.lightGray
        }}>
        
        {/* Left Accent Line */}
        <View
          style={{
            width: 6,
            height: '100%',
            backgroundColor: colors.primaryColor,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            // marginRight: wp(12),
          }}
        />

        {/* Business Info */}
        <View style={{flex: 1, padding: wp(10),}}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(15),
              color: colors.black,
            }}>
            {item?.name}
          </Text>

          <Text
            numberOfLines={2}
            style={{
              fontFamily: fonts.regular,
              fontSize: wp(12),
              color: colors.black,
              marginTop: 4,
            }}>
            {item?.address || item?.formatted_address}
          </Text>
        </View>

        {/* Selection Indicator */}
        <View style={{marginHorizontal: wp(10)}}>
          {isSelected ? (
            <Image
              source={ImageConstants.check_round}
              style={{
                height: wp(25),
                width: wp(25),
                resizeMode: 'contain',
                tintColor: colors.primaryColor,
              }}
            />
          ) : (
            <View
              style={{
                height: wp(25),
                width: wp(25),
                borderWidth: 2,
                borderColor: colors.primaryColor,
                borderRadius: wp(25) / 2,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }}
/>


            <View style={{marginTop: 20}}>
              <CustomButton
                label="Add Business"
                onPress={() => {
                  dispatch(tagBusinessAction(selectedBusiness));
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};
export default TagBusinessScreen;
