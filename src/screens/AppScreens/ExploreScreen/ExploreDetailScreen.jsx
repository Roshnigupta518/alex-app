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
  Platform, StyleSheet, FlatList
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {AddToFavExploreRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import ReadMore from '@fawazahmed/react-native-read-more';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import NotFoundAnime from '../../../components/NotFoundAnime';

const ExploreDetailScreen = ({navigation, route}) => {
  const {data} = route?.params;
  const [isFav, setIsFav] = useState(
    data?.isFavourite || route?.params?.alreadyFaviroute,
  );
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const addToFaviroute = () => {
    setIsFav(!isFav);
    AddToFavExploreRequest({explore_category_id: data?._id})
      .then(res => {
        Toast.success('Explore', res?.message);
      })
      .catch(err => {
        Toast.error('Faviroute', err?.message);
      });
  };

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

  const RenderUserPost = ({item, index}) => {
    console.log({item})
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ReelViewer', {
            data: data.postData,
            currentIndex: index,
          })
        }>
        {item?.postData?.post?.mimetype != 'video/mp4' ? (
          <Image
            source={{uri: item?.postData?.post?.data}}
            style={styles.userPostImage}
          />
        ) : (
          <View style={styles.videoContainer}>
            <View style={styles.playIconStyle}>
              <Image
                source={ImageConstants.play}
                style={{
                  height: wp(60),
                  width: wp(60),
                  alignSelf: 'center',
                }}
              />
            </View>
            <Image
              source={{uri: item?.postData?.post_thumbnail}}
              style={styles.videoPostStyle}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <ImageBackground
          source={{uri: data?.explorelBanner}}
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

                <TouchableOpacity onPress={addToFaviroute}>
                  <Image
                    source={ImageConstants.bookmark}
                    style={{
                      tintColor: isFav ? colors.red : colors.black,
                      height: wp(30),
                      width: wp(30),
                    }}
                  />
                </TouchableOpacity>
              </View>

              {/* <View
                style={{
                  marginVertical: wp(20),
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: colors.primaryColor,
                }}>
                {data?.address?.length > 0 && data?.address != undefined && (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={ImageConstants.blue_location}
                      style={{
                        height: wp(23),
                        width: wp(23),
                        tintColor: colors.black,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: wp(12),
                        color: colors.white,
                        paddingHorizontal: 5,
                      }}>
                      {data?.address[0]}
                    </Text>
                  </View>
                )}

                {data?.phone?.length > 0 && data?.phone != undefined && (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={ImageConstants.phone}
                      style={{
                        height: wp(23),
                        width: wp(23),
                        tintColor: colors.black,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: wp(12),
                        color: colors.white,
                        paddingHorizontal: 5,
                      }}>
                      {data?.phone}
                    </Text>
                  </View>
                )}
              </View> */}

              {/* {data?.description && (
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
              )} */}

              {/* {!isNaN(Number(data?.latitude)) &&
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
                )} */}

                {/* show post thunbnail */}
                <View style={styles.listViewStyle}>

        </View>
        </View>
        <FlatList
            data={data.postData}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            renderItem={RenderUserPost}
            numColumns={2}
          />
           
          </ScrollView>
        </View>
      </View>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default ExploreDetailScreen;

const styles = StyleSheet.create({
  listViewStyle: {
    flex: 1,
    marginTop: 10,
  },
  userPostImage: {
    height: 140,
    width: WIDTH / 2.1,
    margin: 4,
  },
  videoContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 10,
    margin: 4,
  },
  playIconStyle: {
    position: 'absolute',
    top: 75,
    width: WIDTH / 2.1,
    zIndex: 2,
  },
  videoPostStyle: {
    height: 200,
    width: WIDTH / 2.2,
    borderRadius: 10,
  },
})
