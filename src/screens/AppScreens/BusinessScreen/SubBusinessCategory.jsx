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
import {getSubBusinessCategoryRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';
import BackHeader from '../../../components/BackHeader';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';
const SubBusinessCategory = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subCategory, setSubCategory] = useState([]);
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
    getSubBusinessCategoryRequest(route?.params?.id)
      .then(res => {
        setSubCategory(res?.result);
      })
      .catch(err => {
        Toast.error('Business Categories', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <CustomContainer>
        {/* <NotificationSearchHeader /> */}
        <BackHeader />

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
            // alignItems: 'center',
          }}>
          <FlatList
            data={subCategory}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item?.isChildCat) {
                      navigation.navigate('BusinessChildScreen', {
                        id: item?._id,
                        catId: route?.params?.id,
                        subCatId: item?._id,
                        isAddBusiness: route?.params?.addBusiness,
                      });
                      // if (route?.params?.addBusiness) {
                      //   navigation.navigate('BusinessChildScreen', {
                      //     id: item?._id,
                      //     catId: route?.params?.id,
                      //     subCatId: item?._id,
                      //     isAddBusiness: route?.params?.addBusiness,
                      //   });
                      // } else {
                      //   navigation.navigate('SelectedBusinessListingScreen', {
                      //     catId: route?.params?.id,
                      //     subCatId: item?._id,
                      //   });
                      // }
                    } else {
                      if (route?.params?.addBusiness) {
                        navigation.navigate('AddBusinessScreen', {
                          catId: route?.params?.id,
                          subCatId: item?._id,
                        });
                      } else {
                        navigation.navigate('SelectedBusinessListingScreen', {
                          catId: route?.params?.id,
                          subCatId: item?._id,
                        });
                      }
                    }
                  }}
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
                      borderRadius: 10,
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

export default SubBusinessCategory;
