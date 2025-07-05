import React, { useEffect, useState } from 'react';
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
  ActivityIndicator, TouchableWithoutFeedback
} from 'react-native';
import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
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
import { SocialLinks } from '../../../components/social';
import TabsHeader from '../../../components/TabsHeader';
import { tabList } from '../../../validation/helper';
import MediaItem from '../../../components/GridView';
import NotFoundAnime from '../../../components/NotFoundAnime';
import { formatCount } from '../../../validation/helper';
import st from '../../../global/styles';
import FullscreenImageModal from '../../../components/InstagramProfileImageViewer';

const ClaimBusinessScreen = ({ navigation, route }) => {
  const { place_id, name } = route?.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [activeTab, setActiveTab] = useState('photo');
  const [visible, setVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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

  const renderTabContent = () => {
    let filteredData = [];

    if (activeTab === 'photo') {
      filteredData = mediaData.filter(item => item?.postData?.post?.mimetype !== 'video/mp4');
    } else if (activeTab === 'video') {
      filteredData = mediaData.filter(item => item?.postData?.post?.mimetype === 'video/mp4');
    }

    if (filteredData.length === 0) {
      return (
        <NotFoundAnime isLoading={isLoading} />
      );
    }

    return (
      <FlatList
        data={filteredData}
        renderItem={({ item, index }) => (
          <MediaItem
            item={item}
            onPress={() =>
              navigation.navigate('ReelViewer', {
                data: filteredData,
                currentIndex: index,
                onDeletePost: deletedId => {
                  setPostData(prev => prev.filter(item => item?.postData?._id !== deletedId));
                },
              })
            }
            index={index}
          />
        )}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 15 }}
      />
    );
  };

  useEffect(() => {
    getAllData();
  }, []);

  const isLogoAvailable = !!data?.certificate;

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableWithoutFeedback onPress={() => setShowBanner(true)}>
            <ImageBackground
              source={
                data?.banner ? { uri: data?.banner } : ImageConstants.business_banner
              }
              style={{
                height: HEIGHT / 4,
                width: WIDTH,
              }}>
              <SafeAreaView>
                <BackHeader />
              </SafeAreaView>

              <View style={st.cir_pos}>
                
                <View style={st.circle}>
                  <Image source={ImageConstants.send_1} style={st.imgsty} />
                </View>
                <View style={st.circle}>
                  <Image source={ImageConstants.web} style={st.imgsty} />
                </View>
                <View style={st.circle}>
                  <Image source={ImageConstants.call} style={st.imgsty} />
                </View>
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>

          <FullscreenImageModal
            visible={showBanner}
            imageSource={
              data?.banner ? { uri: data?.banner } : ImageConstants.business_banner
            }
            onClose={() => setShowBanner(false)}
          />

          <View
            style={{
              flex: 1,
              backgroundColor: colors.white,
            }}>
            <View style={st.businessInfo}>
              <View style={{width:'25%'}}>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Image
                  source={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
                  style={{
                    height: isLogoAvailable ? wp(70) : wp(70),
                    width: isLogoAvailable ? wp(70) : wp(70),
                    borderRadius: 100,
                    borderWidth: isLogoAvailable ? 3 : 0,
                    borderColor: colors.white,
                    resizeMode: isLogoAvailable ? 'cover' : 'cover',
                  }}
                />
              </TouchableOpacity>
              </View>
              <View style={{width:'65%'}}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: wp(16),
                    color: colors.black,
                  }}>
                  {name}
                </Text>

                <View style={{flexDirection:'row'}}>
                  <View style={{width:'50%'}}>
                  <Text style={styles.btntxt}>{'16.3K'}</Text>
                    <Text style={styles.txtstyle}>Followers</Text>
                  </View>

                  <View style={{width:'50%'}}>
                  <Text style={styles.btntxt}>{'78.5K'}</Text>
                    <Text style={styles.txtstyle}>Likes</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Fullscreen Viewer */}
            <FullscreenImageModal
              visible={visible}
              imageSource={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
              onClose={() => setVisible(false)}
            />
           
              <View>
                <View style={{padding:15}}>
                  <Text style={styles.txtstyle}>
                  Lively outdoor music venue & beer garden decorated with tropical kitsch.
                  </Text>

                  <View style={{ flexDirection:'row', alignItems:'center' }}>
                   <Image source={ImageConstants.maps} style={st.minimgsty} />
                  <Text style={[styles.txtstyle,{color:colors.secondPrimaryColor}]}>1234 Mai st. st petersburg fl 34609</Text>
                  </View>

                  <View style={{ flexDirection:'row', alignItems:'center' }}>
                   <Image source={ImageConstants.clock} style={st.minimgsty} />
                  <Text style={styles.txtstyle}>Open until 2:00 AM</Text>
                  </View>

                  <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.txtstyle}>
                    Also connect with us on 
                  </Text>
                  <View style={{marginLeft:10}}>
                  <SocialLinks data={data} /> 
                  </View>
                  </View>

                </View>

                {/* <View
                  style={styles.socialContent}>
                  <TouchableOpacity
                    onPress={() => getLocationFromGoogle(false)}
                    activeOpacity={0.9}
                    style={styles.button}>
                    <Text style={styles.btntxt}>
                      Direction
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={claimLoading || data?.isClaimed}
                    // onPress={() => console.log('route?.params', route?.params)}
                    // onPress={() => getLocationFromGoogle(true)}
                    activeOpacity={0.9}
                    style={styles.button}>
                    {claimLoading ? (
                      <ActivityIndicator size={'small'} color={colors.white} />
                    ) : (
                      <Text
                        style={styles.btntxt}>
                        {'Website'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => getLocationFromGoogle(false)}
                    activeOpacity={0.9}
                    style={styles.button}>
                    <Text
                      style={styles.btntxt}>
                      Call
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={claimLoading || data?.isClaimed}
                    // onPress={() => console.log('route?.params', route?.params)}
                    onPress={() => getLocationFromGoogle(true)}
                    activeOpacity={0.9}
                    style={[styles.button, { backgroundColor: isClaimed ? colors.primaryColor : colors.white }]}>
                    {claimLoading ? (
                      <ActivityIndicator size={'small'} color={colors.white} />
                    ) : (
                      <Text
                        style={styles.btntxt}>
                        {!isClaimed ? 'Claim' : 'Claimed'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View> */}
                
                <View style={styles.socialContent}>
                  <View style={st.wdh48}>
                    <TouchableOpacity style={st.btnsty}>
                        <Text style={styles.btntxt}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[st.wdh48, {marginLeft:'4%'}]}>
                    <TouchableOpacity style={[st.btnsty, {backgroundColor:colors.white, borderColor:colors.black}]}>
                        <Text style={styles.btntxt}>Claim</Text>
                    </TouchableOpacity>
                  </View>
                </View>
               

              </View>

              <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabList} />
              {renderTabContent()}
            
          </View>
        </ScrollView>

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
  button: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(10),
    paddingVertical: wp(3),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.black,
    marginHorizontal: 2,
    // flex: 1,
    alignItems: 'center',
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
  txtstyle: {
    fontFamily: fonts.regular,
    fontSize: wp(11),
    color: colors.gray,
  },
  btntxt: {
    fontFamily: fonts.semiBold,
    fontSize: wp(13),
    color: colors.black,
    lineHeight:18
  },
  socialContent: {
    flexDirection: 'row',
    paddingHorizontal:15
    // marginTop: 20,
  }
});

export default ClaimBusinessScreen;
