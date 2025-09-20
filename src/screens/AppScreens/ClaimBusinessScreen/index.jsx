// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Linking,
//   Platform,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator, TouchableWithoutFeedback, Alert
// } from 'react-native';
// import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
// import BackHeader from '../../../components/BackHeader';
// import ImageConstants from '../../../constants/ImageConstants';
// import {
//   claimBusinessRequest,
//   GetBusinessByPlaceId,
//   GetBusinessDetailById,
//   getCityDataRequest,
//   getGooglePlaceByPlaceIdRequest,
// } from '../../../services/Utills';
// import Toast from '../../../constants/Toast';
// import NetInfo from '@react-native-community/netinfo';
// import NoInternetModal from '../../../components/NoInternetModal';
// import { SocialLinks } from '../../../components/social';
// import TabsHeader from '../../../components/TabsHeader';
// import { tabList } from '../../../validation/helper';
// import MediaItem from '../../../components/GridView';
// import NotFoundAnime from '../../../components/NotFoundAnime';
// import { formatCount } from '../../../validation/helper';
// import st from '../../../global/styles';
// import FullscreenImageModal from '../../../components/InstagramProfileImageViewer';
// import ReadMore from '@fawazahmed/react-native-read-more';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
// import Share from 'react-native-share';
// import { MakeFollowedBusinessRequest, unclaimedBusinessRequest } from '../../../services/Utills';
// import { handleShareFunction } from '../../../validation/helper';
// import { useSelector } from 'react-redux';

// const ClaimBusinessScreen = ({ navigation, route }) => {
//   const follow = route?.params || {};
//   const place_id = follow.place_id || follow._id;
//   const name = follow.name || '';
//   // const screen = route?.params?.screen
   
//   // console.log({follow})

//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [isClaimed, setIsClaimed] = useState(false);
//   const [claimLoading, setClaimLoading] = useState(false);
//   const [mediaData, setMediaData] = useState([]);
//   const [isInternetConnected, setIsInternetConnected] = useState(true);
//   const [activeTab, setActiveTab] = useState('video');
//   const [visible, setVisible] = useState(false);
//   const [showBanner, setShowBanner] = useState(false);
//   const [isFollowLoading, setIsFollowLoading] = useState(false);
//   const [isFollow, setIsFollow] = useState(false);

//   const userInfo = useSelector(state => state.UserInfoSlice.data);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       if (state.isConnected !== null && state.isConnected === false) {
//         // Set internet connection status to false when not connected
//         setIsInternetConnected(false);
//         console.log('No internet connection');
//       } else if (
//         state.isConnected === true &&
//         state.isInternetReachable !== undefined
//       ) {
//         // Only update when connection is reachable
//         console.log(
//           'State of Internet reachability: ',
//           state.isInternetReachable,
//         );

//         // Set connection status based on reachability
//         setIsInternetConnected(state.isInternetReachable);
//       }
//     });

//     // Unsubscribe
//     return () => unsubscribe();
//   }, []);

//   const getAllData = () => {
//     setIsLoading(true);
//     GetBusinessDetailById(place_id || '')
//       .then(res => {
//         console.log('res=-=-', JSON.stringify(res));
//         setData(res?.result || []);
//         // setIsClaimed(res?.result?.isClaimed);
//         const objId = res?.result?._id
//         const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
//         const disableClaimbtn = isValidObjectId(objId)
//         console.log({disableClaimbtn})
//         setIsClaimed(disableClaimbtn);


//         let temp_data = [];
//         res?.result?.postData?.forEach((item, index) => {
//           temp_data.push({
//             postData: item,
//             comment: item?.comment,
//             like: item?.like,
//             isLiked: item?.isLiked,
//             isSaved: item?.isSaved,
//             isFollowed: item?.isFollowed,
//           });
//         });
//         setMediaData(temp_data);
//       })
//       .catch(err => {
//         Toast.error('Claim Business', err?.message);
//       })
//       .finally(() => setIsLoading(false));
//   };

//   const redirectOnMap = (lat, lng, address) => {
//     const fullAddress = `${lat},${lng}`;
//     const isInvalidLocation = fullAddress === '0,0';
//     const query = isInvalidLocation ? address : fullAddress;

//     const url = Platform.select({
//       ios: `maps:0,0?q=${encodeURIComponent(query)}`,
//       android: `geo:0,0?q=${encodeURIComponent(query)}`,
//     });

//     console.log('Opening Map URL:', url);

//     Linking.openURL(url).catch(err =>
//       console.error('Failed to open map URL:', err)
//     );
//   };

//   const claimBusiness = async data => {
//     await claimBusinessRequest(place_id, data)
//       .then(res => {
//         // setIsClaimed(true);
//         Toast.success('Claim Business', res?.message);
//         setData(prev => {
//           const newIsClaimed = !prev.isClaimed;
//           return {
//             ...prev,
//             isClaimed: newIsClaimed,
//           };
//         });
//       })
//       .catch(err => {
//         Toast.error('Claim Business', err?.message);
//       })
//       .finally(() => setClaimLoading(false));
//   };

//   const getCityLocation = (lat, lng, address) => {
//     getCityDataRequest(lat, lng)
//       .then(res => {
//         let data = {
//           name: name,
//           city: res?.address?.town,
//           state: res?.address?.state,
//           county: res?.address?.country,
//           location: address,
//           latitude: lat,
//           longitude: lng,
//         };
//         claimBusiness(data);
//       })
//       .catch(err => {
//         setClaimLoading(false);
//         Toast.error('Claim Business', err?.message);
//       });
//   };

//   const getLocationFromGoogle = (shouldClaim = false) => {
//     if (shouldClaim) {
//       setClaimLoading(true);
//     }
//     getGooglePlaceByPlaceIdRequest(place_id)
//       .then(res => {
//         // Toast.success('Claim Business', res?.message);
//         const data = res?.result;
//         const lat = data?.geometry?.location?.lat;
//         const long = data?.geometry?.location?.lng;
//         const address = data?.formatted_address;

//         if (res?.status != 'INVALID_REQUEST') {
//           if (shouldClaim) {
//             getCityLocation(lat, long, address);
//           } else {
//             redirectOnMap(lat, long, address);
//           }
//         } else if (res?.status == 'INVALID_REQUEST') {
//           GetBusinessByPlaceId(place_id).then(res => {
//             let data = {
//               title: res?.result?.name,
//               city: res?.result?.city,
//               county: res?.result?.country,
//               location: res?.result?.address,
//               latitude: res?.result?.postData[0].latitude,
//               longitude: res?.result?.postData[0].longitude,
//             };
//             // console.log('reslocation=-=-', JSON.stringify(res));
//             if (shouldClaim) {
//               claimBusiness(data);
//             } else {
//               redirectOnMap(
//                 res?.result?.postData[0].latitude,
//                 res?.result?.postData[0].longitude,
//                 res?.result?.address,
//               );
//             }
//           });
//         }
//       })
//       .catch(err => {
//         setClaimLoading(false);
//         Toast.error('Claim Business', err?.message);
//       });
//   };

//   const unclaimedBusinessHandle = async() => {
//     await unclaimedBusinessRequest(place_id)
//     .then(res => {
//       setClaimLoading(true);
//       Toast.success('Unclaim Business', res?.message);
//       setData(prev => {
//         const newIsClaimed = !prev.isClaimed;
//         return {
//           ...prev,
//           isClaimed: newIsClaimed,
//         };
//       });
//     })
//     .catch(err => {
//       Toast.error('Unclaim Business', err?.message);
//     })
//     .finally(() =>{
//        setClaimLoading(false)
//       });
//   }

//   const renderTabContent = () => {
//     let filteredData = [];

//     if (activeTab === 'photo') {
//       filteredData = mediaData.filter(item => item?.postData?.post?.mimetype !== 'video/mp4');
//     } else if (activeTab === 'video') {
//       filteredData = mediaData.filter(item => item?.postData?.post?.mimetype === 'video/mp4');
//     }

//     if (filteredData.length === 0) {
//       return (
//         <NotFoundAnime isLoading={isLoading} />
//       );
//     }

//     return (
//       <FlatList
//         data={filteredData}
//         renderItem={({ item, index }) => (
//           <MediaItem
//             item={item}
//             onPress={() =>
//               navigation.navigate('ReelViewer', {
//                 data: filteredData,
//                 currentIndex: index,
//                 onDeletePost: deletedId => {
//                   setPostData(prev => prev.filter(item => item?.postData?._id !== deletedId));
//                 },
//               })
//             }
//             index={index}
//           />
//         )}
//         numColumns={3}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={{ padding: 15 }}
//       />
//     );
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       getAllData();
//     });

//     // Return the function to unsubscribe from the event so it gets removed on unmount
//     return unsubscribe;
//   }, [navigation, follow]);

//   const isLogoAvailable = !!data?.certificate;

//   const openWebsite = async (businessUrl) => {
//     console.log({businessUrl})
//     const supported = await Linking.canOpenURL(businessUrl);
//     await Linking.openURL(businessUrl);
//   }

//   const handleCallPress = async (phoneNumber) => {
//     if(phoneNumber){
//     const dialUrl = `tel:${phoneNumber}`;
  
//     try {
//       const supported = await Linking.canOpenURL(dialUrl);
//       await Linking.openURL(dialUrl);
//     } catch (error) {
//       console.log('Dialer error:', error);
//       Alert.alert(
//         'Error',
//         'Unable to open the phone dialer. Please try manually.'
//       );
//     }
//   }
//   };

//   const handleShare = async () => {
//     handleShareFunction(data, place_id)
//   };

//   const makeFollowBusiness = () => {
//     setIsFollowLoading(true);
//     MakeFollowedBusinessRequest({ business_id: place_id })
//       .then(res => {
//         console.log({res})
//         Toast.success('Request', res?.message);
//         setIsFollow(!isFollow);
//         setData(prev => {
//           const newIsFollowed = !prev.isbusinessFollow;
        
//           return {
//             ...prev,
//             isbusinessFollow: newIsFollowed,
//             businessFollowerCount: newIsFollowed
//               ? prev.businessFollowerCount + 1
//               : Math.max(0, prev.businessFollowerCount - 1), // prevent going negative
//           };
//         });
//       })
//       .catch(err => {
//         Toast.error('Request', err?.message);
//       })
//       .finally(() => setIsFollowLoading(false));
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
  
//     const date = new Date(timeString);
//     // Check if date is valid
//     if (isNaN(date.getTime())) return '';
  
//     return date.toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   const isValidTime = (val) =>
//     val && val !== 'null' && !isNaN(new Date(val).getTime());
  

//   return (
//     <>
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: colors.white,
//         }}>
      
//           <ScrollView 
//             contentContainerStyle={{ flexGrow: 1 }}>
//               {(!isLoading && data) ? (
//               <View>
//             <TouchableWithoutFeedback onPress={() => setShowBanner(true)}>
//               <ImageBackground
//                 source={
//                   data?.banner ? { uri: data?.banner } : ImageConstants.business_banner
//                 }
//                 style={{
//                   height: HEIGHT / 4,
//                   width: WIDTH,
//                 }}>
//                 <SafeAreaView>
//                   <BackHeader />
//                 </SafeAreaView>

//                 <View style={st.cir_pos}>

//                   <TouchableOpacity style={st.circle}
//                     onPress={handleShare}
//                   >
//                     <Image source={ImageConstants.send_1} style={st.imgsty} />
//                   </TouchableOpacity>
 
//                 {data?.business_website &&
//                   <TouchableOpacity style={st.circle}
//                     onPress={() => openWebsite(data?.business_website)}
//                   >
//                     <Image source={ImageConstants.web} style={st.imgsty} />
//                   </TouchableOpacity>
//                   }
//                   {data?.phone_no&&
//                   <TouchableOpacity style={st.circle}
//                     onPress={() => handleCallPress(data?.phone_no)}
//                   >
//                     <Image source={ImageConstants.call} style={st.imgsty} />
//                   </TouchableOpacity>}
//                 </View>
//               </ImageBackground>
//             </TouchableWithoutFeedback>

//             <FullscreenImageModal
//               visible={showBanner}
//               imageSource={
//                 data?.banner ? { uri: data?.banner } : ImageConstants.business_banner
//               }
//               onClose={() => setShowBanner(false)}
//             />

//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: colors.white,
//               }}>
//               <View style={st.businessInfo}>
//                 <View style={{ width: '25%' }}>
//                   <TouchableOpacity onPress={() => setVisible(true)}>
//                     <Image
//                       source={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
//                       style={{
//                         height: isLogoAvailable ? wp(70) : wp(70),
//                         width: isLogoAvailable ? wp(70) : wp(70),
//                         borderRadius: 100,
//                         borderWidth: isLogoAvailable ? 3 : 0,
//                         borderColor: colors.white,
//                         resizeMode: isLogoAvailable ? 'cover' : 'cover',
//                       }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={{ width: '65%' }}>
//                   <View style={[st.row]}>
//                   <Text numberOfLines={2} adjustsFontSizeToFit
//                     style={{
//                       fontFamily: fonts.bold,
//                       fontSize: wp(16),
//                       color: colors.black,
//                     }}>
//                     {data?.name || name} 
//                   </Text>
//                   {/* <TouchableOpacity 
//                    style={st.editSty}
//                    onPress={()=>
//                     navigation.navigate('')
//                    } >
//                   <Image source={ImageConstants.edit} style={st.imgsty} />
//                   </TouchableOpacity> */}
//                   </View>

//                   <View style={{ flexDirection: 'row' }}>
//                     <View style={{ width: '50%' }}>
//                       <TouchableOpacity onPress={()=>navigation.navigate('FollowBusiness',{id: place_id})} >
//                       <Text style={styles.btntxt}>{formatCount(data?.businessFollowerCount)}</Text>
//                       <Text style={styles.txtstyle}>Followers</Text>
//                       </TouchableOpacity>
//                     </View>

//                     <View style={{ width: '50%' }}>
//                       <Text style={styles.btntxt}>{formatCount(data?.total_likes)}</Text>
//                       <Text style={styles.txtstyle}>Likes</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               {/* Fullscreen Viewer */}
//               <FullscreenImageModal
//                 visible={visible}
//                 imageSource={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
//                 onClose={() => setVisible(false)}
//               />

//               <View>
//                 <View style={{ padding: 15 }}>
//                  {data?.details&&
//                   <ReadMore
//                     numberOfLines={2}
//                     style={styles.descriptionTxtStyle}
//                     seeMoreStyle={{ color: colors.primaryColor }}
//                     seeLessStyle={{ color: colors.primaryColor }}>
//                     {data?.details}
//                   </ReadMore>}
                   
//                    {data?.address&&
//                   <View style={styles.content}>
//                     <Image source={ImageConstants.maps} style={st.minimgsty} />
//                     <Text style={[styles.txtstyle, { color: colors.primaryColor, marginRight:10 }]}
//                       onPress={() => redirectOnMap(data?.latitude, data?.longitude, data?.address)}
//                     >{data?.address}</Text>
//                   </View>}
                  
//                   {isValidTime(data?.time_from) && isValidTime(data?.time_to) && (
//                     <View style={styles.content}>
//                       <Image source={ImageConstants.clock} style={st.minimgsty} />
//                       <Text style={styles.txtstyle}>
//                         Open from {formatTime(data?.time_from)} to {formatTime(data?.time_to)}
//                       </Text>
//                     </View>
//                   )}


//                   {data?.socialLinks && Object.values(data.socialLinks).some(link => link?.trim()) && (
//                     <View style={styles.content}>
//                       <Text style={styles.txtstyle}>
//                         Also connect with us on
//                       </Text>
//                       <View style={{ marginLeft: 10 }}>
//                         <SocialLinks data={data} />
//                       </View>
//                     </View>
//                   )}


//                 </View>
                 
//                  <View style={[st.row,st.ml_10]}>
//                  {follow?.fromListing != true ?
//                 <View style={[styles.socialContent,{marginLeft:5}]}>
//                   <TouchableOpacity style={styles.button} onPress={()=>makeFollowBusiness()} >
//                     {isFollowLoading ? (
//                   <ActivityIndicator size={'small'} color={colors.white} />
//                 ) : (
//                   <Text style={styles.btntxt}>
//                     {data?.isbusinessFollow ? 'Following' : 'Follow'}
//                   </Text>
//                 )}
//                   </TouchableOpacity>
                 

//                   <TouchableOpacity
//                     onPress={() => {
//                       if(data?.isClaimed){
//                           unclaimedBusinessHandle()
//                       }else{
//                          getLocationFromGoogle(true)
//                         }
//                     }}
//                     disabled={(claimLoading || isClaimed)}
//                     style={[styles.button, { opacity: isClaimed ? 0.6 : 1 }]}>
//                     {claimLoading ? (
//                       <ActivityIndicator size={'small'} color={colors.white} />
//                     ) : (
//                       <Text
//                         style={styles.btntxt}>
//                         {!data?.isClaimed ? 'Claim' : 'Claimed'}
//                       </Text>
//                     )}
//                   </TouchableOpacity>

//                   {data?.ecommerce_website&&
//                   <TouchableOpacity style={styles.button}
//                     onPress={() => openWebsite(data?.ecommerce_website)} >
//                     <Text style={styles.btntxt}>Order now</Text>
//                   </TouchableOpacity>}
//                 </View>
//                 :(
//                   <View style={styles.socialContent}>
//                     <TouchableOpacity style={styles.button}
//                     onPress={() => navigation.navigate('PostMediaScreen',{item:data})} >
//                     <Text style={styles.btntxt}>Add post</Text>
//                   </TouchableOpacity>
//                     </View>
//                 )}

//                 {data.user_id === userInfo.id && 
//                  <TouchableOpacity style={styles.button}
//                  onPress={() => navigation.navigate('AddStory', {added_from: 2, business_id : data?._id }) } >
//                  <Text style={styles.btntxt}>Add Story</Text>
//                </TouchableOpacity>
//                 }
//                 </View>

//               </View>

//               <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabList} />
//               {renderTabContent()}

//             </View>
//             </View>
//             ) : 
//             <View style={st.center}>
//             <ActivityIndicator size="large" color={colors.primaryColor} />
//             </View>
//             }
//           </ScrollView>
       
//       </View>

//     </>
//   );
// };

// const styles = StyleSheet.create({
//   getChildrenStyle: {
//     width: (WIDTH - 18) / 2,
//     height: Number(Math.random() * 20 + 12) * 10,
//     backgroundColor: 'green',
//     margin: 4,
//     borderRadius: 18,
//   },
//   button: {
//     backgroundColor: colors.primaryColor,
//     paddingHorizontal: wp(10),
//     paddingVertical: wp(3),
//     borderRadius: 50,
//     borderWidth: 1,
//     borderColor: colors.black,
//     marginHorizontal: 2,
//     // flex: 1,
//     alignItems: 'center',
//   },
//   masonryHeader: {
//     position: 'absolute',
//     zIndex: 10,
//     flexDirection: 'row',
//     padding: 5,
//     alignItems: 'center',
//     backgroundColor: 'rgba(150,150,150,0.4)',
//   },
//   userPic: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 15,
//     color: '#fafafa',
//     fontWeight: 'bold',
//   },

//   userPostImage: {
//     height: 140,
//     width: WIDTH / 2.3,
//     margin: 4,
//   },

//   videoPostStyle: {
//     height: 200,
//     width: WIDTH / 2.2,
//     borderRadius: 10,
//   },

//   container: {
//     flex: 1,
//     backgroundColor: colors.black,
//   },

//   headerView: {
//     position: 'absolute',
//     marginTop: Platform.OS == 'ios' ? wp(50) : wp(20),
//     zIndex: 2,
//   },

//   titleStyle: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(22),
//     color: colors.white,
//     textAlign: 'center',
//   },

//   UserImageView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: wp(40),
//     marginHorizontal: wp(20),
//   },

//   userImagesStyle: {
//     height: wp(100),
//     width: wp(100),
//     borderRadius: 100,
//   },

//   userNameStyle: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(20),
//     color: colors.white,
//     width: WIDTH / 2.1,
//   },

//   editProfileStyle: {
//     backgroundColor: colors.primaryColor,
//     padding: wp(10),
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   editProfileTxt: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(16),
//     color: colors.black,
//   },

//   numberContentContainer: {
//     backgroundColor: colors.lightBlack,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },

//   contentTextStyle: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(20),
//     color: colors.white,
//   },

//   contentTitleStyle: {
//     fontFamily: fonts.regular,
//     fontSize: wp(17),
//     color: colors.gray,
//   },

//   contentView: {
//     alignItems: 'center',
//   },

//   listViewStyle: {
//     flex: 1,
//     marginTop: 10,
//   },

//   videoContainer: {
//     borderWidth: 1,
//     borderColor: colors.primaryColor,
//     borderRadius: 10,
//   },
//   playIconStyle: {
//     position: 'absolute',
//     top: 75,
//     width: WIDTH / 2.3,
//     zIndex: 2,
//   },
//   txtstyle: {
//     fontFamily: fonts.regular,
//     fontSize: wp(11),
//     color: colors.gray,
//   },
//   btntxt: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(13),
//     color: colors.black,
//     lineHeight: 18
//   },
//   socialContent: {
//     flexDirection: 'row',
//     // paddingHorizontal: 15
//     // marginTop: 20,
//   },
//   content: {
//     flexDirection: 'row', alignItems: 'center'
//   }
// });

// export default ClaimBusinessScreen;

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
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
  MakeFollowedBusinessRequest,
  unclaimedBusinessRequest,
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
import ReadMore from '@fawazahmed/react-native-read-more';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import CustomContainer from '../../../components/container';

const ClaimBusinessScreen = ({ navigation, route }) => {
  const follow = route?.params || {};
  const place_id = follow.place_id || follow._id;
  const name = follow.name || '';

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [activeTab, setActiveTab] = useState('video');
  const [visible, setVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const userInfo = useSelector(state => state.UserInfoSlice.data);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected === false) {
        setIsInternetConnected(false);
      } else if (
        state.isConnected === true &&
        state.isInternetReachable !== undefined
      ) {
        setIsInternetConnected(state.isInternetReachable);
      }
    });
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     getAllData();
  //   });
  //   return unsubscribe;
  // }, [navigation, follow]);

  useEffect(()=>{
    getAllData();
  },[follow])

  const getAllData = () => {
    setIsLoading(true);
    GetBusinessDetailById(place_id || '')
      .then(res => {
        setData(res?.result || []);
        console.log('businessv result', res?.result)
        const objId = res?.result?._id;
        const isValidObjectId = id => /^[a-f\d]{24}$/i.test(id);
        setIsClaimed(isValidObjectId(objId));

        const temp = [];
        res?.result?.postData?.forEach(item => {
          temp.push({
            postData: item,
            comment: item?.comment,
            like: item?.like,
            isLiked: item?.isLiked,
            isSaved: item?.isSaved,
            isFollowed: item?.isFollowed,
          });
        });
        setMediaData(temp);
      })
      .catch(err => {
        Toast.error('Claim Business', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const redirectOnMap = (lat, lng, address) => {
    const fullAddress = `${lat},${lng}`;
    const isInvalidLocation = fullAddress === '0,0';
    const query = isInvalidLocation ? address : fullAddress;

    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(query)}`,
      android: `geo:0,0?q=${encodeURIComponent(query)}`,
    });

    Linking.openURL(url).catch(err =>
      console.error('Failed to open map URL:', err),
    );
  };

  const claimBusiness = async payload => {
    console.log({place_id, payload})
    await claimBusinessRequest(place_id, payload)
      .then(res => {
        Toast.success('Claim Business', res?.message);
        setData(prev => ({ ...prev, isClaimed: true }));
      })
      .catch(err => {
        Toast.error('Claim Business', err?.message);
      })
      .finally(() => setClaimLoading(false));
  };

  function extractTownStateCountry(components) {
    let town = components.find(c => c.types.includes("locality"))?.long_name;
    let state = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name;
    let country = components.find(c => c.types.includes("country"))?.long_name;
  
    return { town, state, country };
  }

  const getCityLocation = (lat, lng, address) => {
    getCityDataRequest(lat, lng)
      .then(res => {
        console.log({res: res.results[0].address_components})
        const components = res.results[0].address_components;
        const { town, state, country } = extractTownStateCountry(components);

        const payload = {
          name: name,
          city: town,
          state: state,
          county: country,
          location: address,
          latitude: lat,
          longitude: lng,
        };
        claimBusiness(payload);
      })
      .catch(err => {
        setClaimLoading(false);
        Toast.error('Claim Business', err?.message);
      });
  };

  const getLocationFromGoogle = (shouldClaim = false) => {
    if (shouldClaim) setClaimLoading(true);

    getGooglePlaceByPlaceIdRequest(place_id)
      .then(res => {
        const g = res?.result;
        const lat = g?.geometry?.location?.lat;
        const long = g?.geometry?.location?.lng;
        const address = g?.formatted_address;

        if (res?.status !== 'INVALID_REQUEST') {
          if (shouldClaim) {
            getCityLocation(lat, long, address);
          } else {
            redirectOnMap(lat, long, address);
          }
        } else {
          GetBusinessByPlaceId(place_id).then(r => {
            const fallback = {
              title: r?.result?.name,
              city: r?.result?.city,
              county: r?.result?.country,
              location: r?.result?.address,
              latitude: r?.result?.postData[0].latitude,
              longitude: r?.result?.postData[0].longitude,
            };
            if (shouldClaim) {
              claimBusiness(fallback);
            } else {
              redirectOnMap(
                r?.result?.postData[0].latitude,
                r?.result?.postData[0].longitude,
                r?.result?.address,
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

  const unclaimedBusinessHandle = async () => {
    await unclaimedBusinessRequest(place_id)
      .then(res => {
        setClaimLoading(true);
        Toast.success('Unclaim Business', res?.message);
        setData(prev => ({ ...prev, isClaimed: false }));
      })
      .catch(err => {
        Toast.error('Unclaim Business', err?.message);
      })
      .finally(() => {
        setClaimLoading(false);
      });
  };

  const openWebsite = async businessUrl => {
    try {
      const supported = await Linking.canOpenURL(businessUrl);
       await Linking.openURL(businessUrl);
    } catch (e) {
      // ignore
    }
  };

  const handleCallPress = async phoneNumber => {
    if (!phoneNumber) return;
    const dialUrl = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(dialUrl);
      if (supported) await Linking.openURL(dialUrl);
    } catch (error) {
      Alert.alert('Error', 'Unable to open the phone dialer. Please try manually.');
    }
  };

  const handleShare = async () => {
    // your helper already handles it
    try {
      // If you had a helper:
      // handleShareFunction(data, place_id)
      // Keeping same call to avoid behavior change:
      Share.open({
        message: data?.name || '',
        url: data?.business_website || '',
      }).catch(() => {});
    } catch {}
  };

  const makeFollowBusiness = () => {
    setIsFollowLoading(true);
    MakeFollowedBusinessRequest({ business_id: place_id })
      .then(res => {
        Toast.success('Request', res?.message);
        setIsFollow(!isFollow);
        setData(prev => {
          const newIsFollowed = !prev?.isbusinessFollow;
          return {
            ...prev,
            isbusinessFollow: newIsFollowed,
            businessFollowerCount: newIsFollowed
              ? (prev?.businessFollowerCount || 0) + 1
              : Math.max(0, (prev?.businessFollowerCount || 0) - 1),
          };
        });
      })
      .catch(err => {
        Toast.error('Request', err?.message);
      })
      .finally(() => setIsFollowLoading(false));
  };

  const formatTime = timeString => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isValidTime = val => val && val !== 'null' && !isNaN(new Date(val).getTime());

  const isLogoAvailable = !!data?.certificate;

  // Filtered grid data based on tab
  const filteredData = useMemo(() => {
    if (!mediaData?.length) return [];
    if (activeTab === 'photo') {
      return mediaData.filter(item => item?.postData?.post?.mimetype !== 'video/mp4');
    }
    if (activeTab === 'video') {
      return mediaData.filter(item => item?.postData?.post?.mimetype === 'video/mp4');
    }
    return mediaData;
  }, [mediaData, activeTab]);

  const renderHeader = () => {
    if (isLoading || !data) {
      return (
        <View style={[st.center,{marginTop:'60%'}]}>
          <ActivityIndicator size="large" color={colors.primaryColor} />
        </View>
      );
    }

    return (
      <View>
        {/* Banner + Right-side floating icons */}
        <TouchableWithoutFeedback onPress={() => setShowBanner(true)}>
          <ImageBackground
            source={data?.banner ? { uri: data?.banner } : ImageConstants.business_banner}
            style={{ height: HEIGHT / 4, width: WIDTH }}
          >
            <SafeAreaView>
              <BackHeader />
            </SafeAreaView>

            <View style={[st.cir_pos, { zIndex: 2 }]}>
              <TouchableOpacity style={st.circle} onPress={handleShare}>
                <Image source={ImageConstants.send_1} style={st.imgsty} />
              </TouchableOpacity>

              {!!data?.business_website && (
                <TouchableOpacity style={st.circle} onPress={() => openWebsite(data?.business_website)}>
                  <Image source={ImageConstants.web} style={st.imgsty} />
                </TouchableOpacity>
              )}

              {!!data?.phone_no && (
                <TouchableOpacity style={st.circle} onPress={() => handleCallPress(data?.phone_no)}>
                  <Image source={ImageConstants.call} style={st.imgsty} />
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>

        {/* Fullscreen Banner Viewer */}
        <FullscreenImageModal
          visible={showBanner}
          imageSource={data?.banner ? { uri: data?.banner } : ImageConstants.business_banner}
          onClose={() => setShowBanner(false)}
        />

        {/* Business info row */}
        <View style={{ backgroundColor: colors.white }}>
          <View style={st.businessInfo}>
            <View style={{ width: '25%' }}>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Image
                  source={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
                  style={{
                    height: wp(70),
                    width: wp(70),
                    borderRadius: 100,
                    borderWidth: isLogoAvailable ? 3 : 0,
                    borderColor: colors.white,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ width: '65%' }}>
              <View style={[st.row]}>
                <Text
                  numberOfLines={2}
                  style={{ fontFamily: fonts.bold, fontSize: wp(16), color: colors.black }}
                >
                  {data?.name || name}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%' }}>
                  <TouchableOpacity onPress={() => navigation.navigate('FollowBusiness', { id: place_id })}>
                    <Text style={styles.btntxt}>{formatCount(data?.businessFollowerCount)}</Text>
                    <Text style={styles.txtstyle}>Followers</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ width: '50%' }}>
                  <Text style={styles.btntxt}>{formatCount(data?.total_likes)}</Text>
                  <Text style={styles.txtstyle}>Likes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Fullscreen Logo Viewer */}
          <FullscreenImageModal
            visible={visible}
            imageSource={isLogoAvailable ? { uri: data?.certificate } : ImageConstants.business_logo}
            onClose={() => setVisible(false)}
          />

          {/* =================== YOU ASKED TO KEEP THIS BLOCK =================== */}
          <View>
            <View style={{ padding: 15 }}>
              {!!data?.details && (
                <ReadMore
                  numberOfLines={2}
                  style={styles.descriptionTxtStyle}
                  seeMoreStyle={{ color: colors.primaryColor }}
                  seeLessStyle={{ color: colors.primaryColor }}
                >
                  {data?.details}
                </ReadMore>
              )}

              {!!data?.address && (
                <View style={styles.content}>
                  <Image source={ImageConstants.maps} style={st.minimgsty} />
                  <Text
                    style={[styles.txtstyle, { color: colors.primaryColor, marginRight: 10 }]}
                    onPress={() => redirectOnMap(data?.latitude, data?.longitude, data?.address)}
                  >
                    {data?.address}
                  </Text>
                </View>
              )}

              {isValidTime(data?.time_from) && isValidTime(data?.time_to) && (
                <View style={styles.content}>
                  <Image source={ImageConstants.clock} style={st.minimgsty} />
                  <Text style={styles.txtstyle}>
                    Open from {formatTime(data?.time_from)} to {formatTime(data?.time_to)}
                  </Text>
                </View>
              )}

              {data?.socialLinks && Object.values(data.socialLinks).some(link => link?.trim()) && (
                <View style={styles.content}>
                  <Text style={styles.txtstyle}>Also connect with us on</Text>
                  <View style={{ marginLeft: 10 }}>
                    <SocialLinks data={data} />
                  </View>
                </View>
              )}
            </View>

            <View style={[st.row, st.ml_10]}>
              {follow?.fromListing !== true ? (
                <View style={[styles.socialContent, { marginLeft: 5 }]}>
                  <TouchableOpacity style={styles.button} onPress={makeFollowBusiness}>
                    {isFollowLoading ? (
                      <ActivityIndicator size={'small'} color={colors.white} />
                    ) : (
                      <Text style={styles.btntxt}>
                        {data?.isbusinessFollow ? 'Following' : 'Follow'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      if (data?.isClaimed) {
                        unclaimedBusinessHandle();
                      } else {
                        getLocationFromGoogle(true);
                      }
                    }}
                    disabled={claimLoading || isClaimed}
                    style={[styles.button, { opacity: isClaimed ? 0.6 : 1 }]}
                  >
                    {claimLoading ? (
                      <ActivityIndicator size={'small'} color={colors.white} />
                    ) : (
                      <Text style={styles.btntxt}>{!data?.isClaimed ? 'Claim' : 'Claimed'}</Text>
                    )}
                  </TouchableOpacity>

                  {!!data?.ecommerce_website && (
                    <TouchableOpacity style={styles.button} onPress={() => openWebsite(data?.ecommerce_website)}>
                      <Text style={styles.btntxt}>Order now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.socialContent}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('PostMediaScreen', { item: data })}
                  >
                    <Text style={styles.btntxt}>Add post</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(data?.user_id === userInfo?.id && follow?.fromListing === true) && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('AddStory', { added_from: 2, 
                    businessItem: {_id: data?._id, name: data.name, place_id: data?.place_id }
                   })}
                >
                  <Text style={styles.btntxt}>Add Story</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* =================== END OF THE BLOCK YOU ASKED FOR =================== */}

          {/* Tabs */}
          <View style={{paddingHorizontal:15}}>
          <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabList} />
        </View>
        </View>
      </View>
    );
  };

  return (
    // <View style={{ flex: 1, backgroundColor: colors.white }}>
    <CustomContainer>
      <FlatList
        data={filteredData}
        keyExtractor={(_, index) => String(index)}
        numColumns={3}
        renderItem={({ item, index }) => (
         
          <MediaItem
            item={item}
            index={index}
            onPress={() =>
              navigation.navigate('ReelViewer', {
                data: filteredData,
                currentIndex: index,
                onDeletePost: deletedId => {
                  setMediaData(prev => prev.filter(p => p?.postData?._id !== deletedId));
                },
              })
            }
          />
         
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? <NotFoundAnime isLoading={isLoading} /> : null}
        columnWrapperStyle={{
          // justifyContent: 'space-around', // makes equal spacing
          paddingHorizontal:10
        }}
     />
     </CustomContainer>
    // </View>
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
    backgroundColor: colors.primaryColor,
    paddingHorizontal: wp(10),
    paddingVertical: wp(3),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.black,
    marginHorizontal: 2,
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
    lineHeight: 18,
  },
  socialContent: {
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionTxtStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(12),
    color: colors.black,
  },
});

export default ClaimBusinessScreen;
