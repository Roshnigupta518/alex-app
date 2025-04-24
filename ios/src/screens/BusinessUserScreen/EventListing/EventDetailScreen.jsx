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
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {AddToFavExploreRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import ReadMore from '@fawazahmed/react-native-read-more';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const EventDetailScreen = ({navigation, route}) => {
  const {data} = route?.params;
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
    console.log('data?.coordinates[0]=-=-=-', JSON.stringify(data));
    let fullAddress = `${data?.latitude || data?.loc?.coordinates[0]},${
      data?.longitude || data?.loc?.coordinates[1]
    }`;

    console.log('`maps:0,0?q=${fullAddress}`', `maps:0,0?q=${fullAddress}`);

    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress}`,
      android: `geo:0,0?q=${fullAddress}`,
    });

    Linking.openURL(url);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <ImageBackground
          source={ImageConstants.event_banner}
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
            <Image
              source={{uri: data?.logo}}
              style={{
                height: wp(80),
                width: wp(80),
                borderRadius: 40,
              }}
            />
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
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: wp(16),
                      color: colors.black,
                    }}>
                    {data?.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: wp(13),
                      color: colors.black,
                    }}>
                    {data?.subTitle}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={ImageConstants.calendar}
                    style={{
                      height: wp(20),
                      width: wp(20),
                      tintColor: colors.primaryColor,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      color: colors.primaryColor,
                      fontSize: wp(14),
                      marginLeft: wp(5),
                    }}>
                    {moment(data?.date, 'DD-MM-YYYY').format('dddd, DD MMMM')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={ImageConstants.timer}
                    style={{
                      height: wp(20),
                      width: wp(20),
                      tintColor: colors.primaryColor,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      color: colors.primaryColor,
                      fontSize: wp(14),
                      marginLeft: wp(5),
                    }}>
                    {data?.time}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginVertical: wp(20),
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: colors.lightPrimaryColor,
                }}>
                {data?.location?.length > 0 && data?.location != undefined && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 4,
                    }}>
                    <Image
                      source={ImageConstants.blue_location}
                      style={{
                        height: wp(23),
                        width: wp(23),
                        tintColor: colors.primaryColor,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: wp(12),
                        color: colors.black,
                        paddingHorizontal: 5,
                      }}>
                      {data?.location}
                    </Text>
                  </View>
                )}

                {data?.phone?.length > 0 && data?.phone != undefined && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={ImageConstants.phone}
                        style={{
                          height: wp(23),
                          width: wp(23),
                          tintColor: colors.primaryColor,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: wp(12),
                          color: colors.black,
                          paddingHorizontal: 5,
                        }}>
                        {data?.phone}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={ImageConstants.wallet}
                        style={{
                          height: wp(23),
                          width: wp(23),
                          tintColor: colors.primaryColor,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: wp(12),
                          color: colors.black,
                          paddingHorizontal: 5,
                        }}>
                        $ {data?.entry_fee}{' '}
                        <Text
                          style={{fontFamily: fonts.regular, fontSize: wp(10)}}>
                          (entery fee)
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {data?.description && (
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
                    {data?.description}
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

                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <FlatList
                      data={[...data?.image] || []}
                      horizontal={true}
                      scrollEnabled={false}
                      renderItem={({item, index}) => {
                        return (
                          <Image
                            source={{uri: item}}
                            style={{
                              height: wp(230),
                              width: wp(230),
                              resizeMode: 'contain',
                              margin: 5,
                            }}
                          />
                        );
                      }}
                    />
                  </View>
                </View>
              )}

              {!isNaN(Number(data?.latitude)) &&
                !isNaN(Number(data?.longitude)) && (
                  <View
                    style={{
                      height: HEIGHT / 5,
                      marginTop: wp(30),
                    }}>
                    <MapView
                      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                      style={{
                        flex: 1,
                        borderRadius: 20,
                      }}
                      region={{
                        latitude:
                          Number(data?.latitude) ||
                          Number(data?.loc?.coordinates[0]),

                        longitude:
                          Number(data?.longitude) ||
                          Number(data?.loc?.coordinates[1]),
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      }}
                    />

                    <View
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        alignSelf: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={redirectOnMap}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: colors.primaryColor,
                          padding: wp(15),
                          width: WIDTH / 1.3,
                          borderRadius: 10,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: fonts.semiBold,
                            fontSize: wp(16),
                            color: colors.white,
                          }}>
                          Get Direction
                        </Text>
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

export default EventDetailScreen;
