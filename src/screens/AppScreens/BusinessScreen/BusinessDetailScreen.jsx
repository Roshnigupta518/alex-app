import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import ReadMore from '@fawazahmed/react-native-read-more';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const BusinessDetailScreen = ({navigation, route}) => {
  const {data} = route?.params;
  const latitude = Number(data?.latitude);
  const longitude = Number(data?.longitude);
  const isValidLatitude = !isNaN(latitude) && latitude !== '';
  const isValidLongitude = !isNaN(longitude) && longitude !== '';
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
  const redirectOnMap = () => {
    let fullAddress = `${data?.latitude},${data?.longitude}`;

    console.log('`maps:0,0?q=${fullAddress}`', `maps:0,0?q=${fullAddress}`);

    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress === ',' ? data?.address : fullAddress}`,
      android: `geo:0,0?q=${fullAddress === ',' ? data?.address : fullAddress}`,
    });

    Linking.openURL(url);
  };
  const handleAddressChange = async () => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCABJJWcr1RWOLV5ur_0bpZuWpayOS1ETY&input=${data?.address}`;
    try {
      const result = await fetch(url);
      const json = await result.json();
      console.log(JSON.stringify(json));
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    console.log('data=-=', JSON.stringify(route?.params));
    handleAddressChange();
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <ImageBackground
          source={
            data?.banner ? {uri: data?.banner} : ImageConstants.business_banner
          }
          style={{
            height: HEIGHT / 3,
            width: WIDTH,
          }}>
          <SafeAreaView>
            <BackHeader />
          </SafeAreaView>
        </ImageBackground>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -40,
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              padding: 6,
              borderRadius: 80,
              alignSelf: 'center',
              marginTop: -50,
            }}>
            {data?.certificate != '' ? (
              <Image
                source={{uri: data?.certificate}}
                style={{
                  height: wp(80),
                  width: wp(80),
                  borderRadius: 40,
                }}
              />
            ) : (
              <Image
                source={ImageConstants.business_logo}
                style={{
                  height: wp(90),
                  width: wp(80),
                  borderRadius: 40,
                }}
              />
            )}
          </View>

          <ScrollView>
            <View
              style={{
                margin: wp(15),
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <View style={{width: 30}} />
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: wp(16),
                      color: colors.black,
                    }}>
                    {data?.name}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: wp(20),
                }}>
                <Image
                  source={ImageConstants.blue_location}
                  style={{
                    height: wp(25),
                    width: wp(25),
                    tintColor: colors.primaryColor,
                  }}
                />

                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: wp(13),
                    color: colors.primaryColor,
                    marginHorizontal: 10,
                  }}>
                  {data?.address}
                </Text>
              </View>

              {data?.details && (
                <View>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(16),
                      color: colors.primaryColor,
                    }}>
                    Business Description
                  </Text>

                  <ReadMore
                    numberOfLines={4}
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: wp(13),
                      color: colors.black,
                    }}
                    seeMoreStyle={{color: colors.primaryColor}}
                    seeLessStyle={{color: colors.primaryColor}}>
                    {data?.details}
                  </ReadMore>
                </View>
              )}

              {data?.image?.length > 0 && (
                <View style={{marginTop: 30}}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(16),
                      color: colors.primaryColor,
                    }}>
                    Photos
                  </Text>

                  <View style={{alignItems: 'center'}}>
                    <FlatList
                      data={[...data?.image] || []}
                      horizontal={true}
                      scrollEnabled={false}
                      renderItem={({item, index}) => {
                        return (
                          <Image
                            source={{uri: item}}
                            style={{
                              height: 210,
                              width: 200,
                              margin: 10,
                              resizeMode: 'stretch',
                            }}
                          />
                        );
                      }}
                    />
                  </View>
                </View>
              )}

              {isValidLatitude && isValidLongitude && (
                <View style={styles.mapContainer}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // Remove if not using Google Maps
                    style={styles.map}
                    region={{
                      latitude,
                      longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={redirectOnMap}
                      activeOpacity={0.8}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Get Direction</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};
const styles = StyleSheet.create({
  mapContainer: {
    height: HEIGHT / 5,
    marginTop: wp(30),
  },
  map: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colors.primaryColor,
    padding: wp(15),
    width: WIDTH / 1.3,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.white,
  },
});
export default BusinessDetailScreen;
