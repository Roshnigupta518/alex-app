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
  ActivityIndicator,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {
  claimBusinessRequest,
  GetBusinessByPlaceId,
  GetBusinessDetailById,
  getCityDataRequest,
  getGooglePlaceByPlaceIdRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const ClaimBusinessScreen = ({navigation, route}) => {
  const {place_id, name} = route?.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [mediaData, setMediaData] = useState([]);
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
  const getAllData = () => {
    setIsLoading(true);
    GetBusinessDetailById(place_id || '')
      .then(res => {
        console.log('res=-=-', JSON.stringify(res));
        setData(res?.result || []);
        setIsClaimed(res?.result?.isClaimed);
        let temp_data = [];
        res?.result?.postData?.forEach((item, index) => {
          temp_data.push({
            postData: item,
            comment: item?.comment,
            like: item?.like,
            isLiked: item?.isLiked,
            isSaved: item?.isSaved,
            isFollowed: item?.isFollowed,
          });
        });
        setMediaData(temp_data);
      })
      .catch(err => {
        Toast.error('Claim Business', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const redirectOnMap = (lat, lng, address) => {
    let fullAddress = `${lat},${lng}`;
    console.log(
      '`maps:0,0?q=${fullAddress}`',
      `maps:0,0?q=${fullAddress === '0,0' ? address : fullAddress}`,
    );
    const url = Platform.select({
      ios: `maps:0,0?q=${fullAddress === '0,0' ? address : fullAddress}`,
      android: `geo:0,0?q=${fullAddress === '0,0' ? address : fullAddress}`,
    });

    Linking.openURL(url);
  };

  const claimBusiness = async data => {
    await claimBusinessRequest(place_id, data)
      .then(res => {
        setIsClaimed(true);
        Toast.success('Claim Business', res?.message);
      })
      .catch(err => {
        Toast.error('Claim Business', err?.message);
      })
      .finally(() => setClaimLoading(false));
  };

  const getCityLocation = (lat, lng, address) => {
    getCityDataRequest(lat, lng)
      .then(res => {
        let data = {
          name: name,
          city: res?.address?.town,
          state: res?.address?.state,
          county: res?.address?.country,
          location: address,
          latitude: lat,
          longitude: lng,
        };
        claimBusiness(data);
      })
      .catch(err => {
        setClaimLoading(false);
        Toast.error('Claim Business', err?.message);
      });
  };

  const getLocationFromGoogle = (shouldClaim = false) => {
    if (shouldClaim) {
      setClaimLoading(true);
    }
    getGooglePlaceByPlaceIdRequest(place_id)
      .then(res => {
        // Toast.success('Claim Business', res?.message);
        const data = res?.result;
        const lat = data?.geometry?.location?.lat;
        const long = data?.geometry?.location?.lng;
        const address = data?.formatted_address;

        if (res?.status != 'INVALID_REQUEST') {
          if (shouldClaim) {
            getCityLocation(lat, long, address);
          } else {
            redirectOnMap(lat, long, address);
          }
        } else if (res?.status == 'INVALID_REQUEST') {
          GetBusinessByPlaceId(place_id).then(res => {
            let data = {
              title: res?.result?.name,
              city: res?.result?.city,
              county: res?.result?.country,
              location: res?.result?.address,
              latitude: res?.result?.postData[0].latitude,
              longitude: res?.result?.postData[0].longitude,
            };
            // console.log('reslocation=-=-', JSON.stringify(res));
            if (shouldClaim) {
              claimBusiness(data);
            } else {
              redirectOnMap(
                res?.result?.postData[0].latitude,
                res?.result?.postData[0].longitude,
                res?.result?.address,
              );
            }
          });
        }
      })
      .catch(err => {
        setClaimLoading(false);
        Toast.error('Claim Business', err?.message);
      });
  };

  const RenderUserPost = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{margin: 0, padding: 4}}
        onPress={() =>
          navigation.navigate('ReelViewer', {
            data: mediaData,
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
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                }}
              />
            </View>
            <Image
              source={{uri: item?.postData?.post_thumbnail}}
              style={{
                height: 200,
                width: WIDTH / 2.3,
                borderRadius: 10,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getAllData();
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
          <View>
            {data?.certificate != '' && data?.certificate != undefined ? (
              <Image
                source={{uri: data?.certificate}}
                style={{
                  height: wp(80),
                  width: wp(80),
                  alignSelf: 'center',
                  borderRadius: 100,
                  marginTop: -40,
                  borderWidth: 3,
                  borderColor: colors.white,
                  resizeMode: 'stretch',
                }}
              />
            ) : (
              <Image
                source={ImageConstants.business_logo}
                style={{
                  alignSelf: 'center',
                  borderRadius: 100,
                  marginTop: -40,
                }}
              />
            )}
          </View>

          <ScrollView
            style={{marginTop: -30}}
            contentContainerStyle={{flexGrow: 1}}>
            <View
              style={{
                flex: 1,
                marginHorizontal: wp(15),
              }}>
              <View>
                <View style={{width: 30}} />
                <View style={{marginTop: 50}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: wp(16),
                      color: colors.black,
                    }}>
                    {name}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    disabled={claimLoading || data?.isClaimed}
                    // onPress={() => console.log('route?.params', route?.params)}
                    onPress={() => getLocationFromGoogle(true)}
                    activeOpacity={0.9}
                    style={{
                      backgroundColor: colors.primaryColor,
                      paddingHorizontal: wp(20),
                      paddingVertical: wp(13),
                      borderRadius: 5,
                      marginHorizontal: 2,
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    {claimLoading ? (
                      <ActivityIndicator size={'small'} color={colors.white} />
                    ) : (
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: wp(11),
                          color: colors.black,
                        }}>
                        {!isClaimed ? 'Claim Your Business' : 'Already Claimed'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => getLocationFromGoogle(false)}
                    activeOpacity={0.9}
                    style={{
                      backgroundColor: colors.primaryColor,
                      paddingHorizontal: wp(20),
                      paddingVertical: wp(13),
                      borderRadius: 5,
                      marginHorizontal: 5,
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize: wp(11),
                        color: colors.black,
                      }}>
                      Direction
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  marginTop: 30,
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: wp(14),
                    color: colors.primaryColor,
                  }}>
                  Photos
                </Text>
                <FlatList
                  data={mediaData}
                  renderItem={RenderUserPost}
                  numColumns={2}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  getChildrenStyle: {
    width: (WIDTH - 18) / 2,
    height: Number(Math.random() * 20 + 12) * 10,
    backgroundColor: 'green',
    margin: 4,
    borderRadius: 18,
  },
  masonryHeader: {
    position: 'absolute',
    zIndex: 10,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.4)',
  },
  userPic: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    color: '#fafafa',
    fontWeight: 'bold',
  },

  userPostImage: {
    height: 140,
    width: WIDTH / 2.3,
    margin: 4,
  },

  videoPostStyle: {
    height: 200,
    width: WIDTH / 2.2,
    borderRadius: 10,
  },

  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  headerView: {
    position: 'absolute',
    marginTop: Platform.OS == 'ios' ? wp(50) : wp(20),
    zIndex: 2,
  },

  titleStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(22),
    color: colors.white,
    textAlign: 'center',
  },

  UserImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(40),
    marginHorizontal: wp(20),
  },

  userImagesStyle: {
    height: wp(100),
    width: wp(100),
    borderRadius: 100,
  },

  userNameStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(20),
    color: colors.white,
    width: WIDTH / 2.1,
  },

  editProfileStyle: {
    backgroundColor: colors.primaryColor,
    padding: wp(10),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  editProfileTxt: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.black,
  },

  numberContentContainer: {
    backgroundColor: colors.lightBlack,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  contentTextStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(20),
    color: colors.white,
  },

  contentTitleStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(17),
    color: colors.gray,
  },

  contentView: {
    alignItems: 'center',
  },

  listViewStyle: {
    flex: 1,
    marginTop: 10,
  },

  videoContainer: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 10,
  },
  playIconStyle: {
    position: 'absolute',
    top: 75,
    width: WIDTH / 2.3,
    zIndex: 2,
  },
});

export default ClaimBusinessScreen;
