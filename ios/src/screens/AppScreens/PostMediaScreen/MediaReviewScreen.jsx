import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import CustomButton from '../../../components/CustomButton';
import {Video, ResizeMode} from 'expo-av';
import Toast from '../../../constants/Toast';
import {useDispatch, useSelector} from 'react-redux';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {AddAddressAction} from '../../../redux/Slices/AddAddressSlice';
import Storage from '../../../constants/Storage';
import {api, BASE_URL} from '../../../services/WebConstants';
import NoInternetModal from '../../../components/NoInternetModal';

import NetInfo from '@react-native-community/netinfo';
const MediaReviewScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const tagPeopleList = useSelector(state => state.TagPeopleSlice?.data);
  const tagBusinessList = useSelector(state => state.TagBusinessSlice?.data);
  const AddAddressValues = useSelector(state => state.AddAddressSlice?.data);

  const video = useRef(null);
  const [apiCalledCount, setApiCalledCount] = useState({
    count: 0,
  });
  const [allTagListIds, setAllTagListIds] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [state, setState] = useState({
    address: '',
    lat: null,
    lng: null,
  });
  const [locationState, setLocationState] = useState({
    name: '',
    place_id: '',
  });
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected === false) {
        setIsInternetConnected(false);
        console.log('No internet connection');
      } else if (
        state.isConnected === true &&
        state.isInternetReachable !== undefined
      ) {
        // Set connection status based on reachability
        setIsInternetConnected(true);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  const generateThumbnail = async () => {
    try {
      const {uri} = await VideoThumbnails.getThumbnailAsync(
        route?.params?.media?.uri,
        {
          time: 2000,
        },
      );

      let fileName = uri?.split('/');
      setVideoThumbnail({
        name: fileName[fileName?.length - 1],
        type: 'image/jpeg',
        uri: uri,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const validateFields = () => {
    console.log('locationState?.place_id', locationState?.place_id);
    if (locationState?.place_id == '' || locationState?.place_id == undefined) {
      Toast.error('Business', 'Please tag business!');
    } else if (AddAddressValues?.address == null) {
      Toast.error('Address', 'Please tag location for post!');
    } else {
      uploadMedia();
    }
  };

  const uploadMedia = async () => {
    setIsLoading(true);
    try {
      let formData = new FormData();
      formData.append('type', route?.params?.media_type == 'photo' ? '1' : '2');
      formData.append('caption', caption);
      formData.append('post', route?.params?.media);
      if (videoThumbnail != null) {
        formData.append('post_thumbnail', videoThumbnail);
      }
      if (allTagListIds?.length > 0) {
        formData.append('taggedUsers', allTagListIds);
      }

      if (AddAddressValues?.address != null) {
        formData.append('location', AddAddressValues.address);
        formData.append('latitude', AddAddressValues.lat);
        formData.append('longitude', AddAddressValues.lng);
      }

      if (
        locationState?.place_id != undefined &&
        locationState?.place_id != ''
      ) {
        formData.append(
          'tagBussiness',
          JSON.stringify({
            place_id: locationState?.place_id,
            name: locationState?.name,
          }),
        );
      }
      let temp_token = await Storage.get('userdata');

      let customHeader = new Headers();
      customHeader.append('Authorization', 'Bearer ' + temp_token?.token);
      customHeader.append('Content-Type', 'multipart/form-data');

      console.log('see header: ', customHeader, '\n', JSON.stringify(formData));

      fetch(BASE_URL + api.addPost, {
        method: 'POST',
        body: formData,
        headers: customHeader,
        redirect: 'follow',
      })
        .then(response => response.json())
        .then(responseData => {
          console.log('responseData-=-=-', JSON.stringify(responseData));
          if (responseData?.status) {
            Toast.success('Post', responseData?.message);
            navigation.navigate('Home', {shouldScrollTopReel: true});
          } else {
            Toast.error('Post', responseData?.message);
          }
          setIsLoading(false);
        })
        .catch(error => {
          if (error != null && error != undefined) {
            if (apiCalledCount.count == 0) {
              apiCalledCount.count += 1;
              uploadMedia();
            } else {
              Toast.error('Post', error?.message);
              setIsLoading(false);
            }
          }
        });
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }

    // try {
    //   UploadPostMediaRequest(formData)
    //     .then(res => {
    //       Toast.success('Post', res?.message);
    //       navigation.navigate('Home', {shouldScrollTopReel: true});
    //     })
    //     .catch(err => {
    //       console.log('err 12: ', err);
    //       Toast.error('Post', err?.message);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // } catch (err) {
    //   console.log('err cv', err);
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    if (tagPeopleList?.length > 0) {
      let ids = [];
      tagPeopleList?.forEach(item => ids?.push(item?._id));
      setAllTagListIds(JSON.stringify(ids));
    } else {
      setAllTagListIds('');
    }
  }, [tagPeopleList]);

  useEffect(() => {
    let id = tagBusinessList?._id || tagBusinessList?.place_id;
    let location =
      tagBusinessList?.address || tagBusinessList?.formatted_address;
    let lat =
      tagBusinessList?.latitude || tagBusinessList?.geometry?.location?.lat;
    let lng =
      tagBusinessList?.longitude || tagBusinessList?.geometry?.location?.lng;

    setLocationState(prevState => ({
      ...prevState,
      place_id: id,
      name: tagBusinessList?.name,
    }));

    dispatch(
      AddAddressAction({
        address: location,
        lat: lat,
        lng: lng,
        isBusiness: true,
        placeId: id,
      }),
    );
  }, [tagBusinessList]);

  useEffect(() => {
    if (tagBusinessList != null) {
      setState(prevState => ({
        ...prevState,
        address: tagBusinessList?.address,
        lng: tagBusinessList?.longitude,
        lat: tagBusinessList?.latitude,
      }));
    }
  }, [tagBusinessList]);

  useEffect(() => {
    if (route?.params?.media_type != 'photo') {
      generateThumbnail();
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.backButtonStyle}>
          <BackHeader />
        </View>
        <KeyboardAvoidingScrollView>
          {route?.params?.media_type == 'photo' ? (
            <Image
              source={{uri: route?.params?.media?.uri}}
              style={styles.imageStyle}
            />
          ) : (
            <Video
              ref={video}
              style={styles.video}
              source={{
                uri: route?.params?.media?.uri,
              }}
              useNativeControls={true}
              resizeMode={ResizeMode.CONTAIN}
            />
          )}

          <View style={styles.inputContainer}>
            <View>
              <Text style={styles.inputTitleStyle}>Add Caption</Text>

              <TextInput
                style={styles.captionInputStyle}
                multiline={true}
                placeholder="Write your caption..."
                value={caption}
                onChangeText={txt => setCaption(txt)}
              />
            </View>

            {/* Tag people */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TagPeopleScreen')}
              style={{marginTop: wp(20)}}>
              <Text style={styles.inputTitleStyle}>Add People</Text>

              <View style={styles.inputParentView}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: wp(13),
                      color: colors.black,
                    }}>
                    {tagPeopleList?.map(item => {
                      return '@' + item?.anonymous_name + '  ';
                    })}
                  </Text>
                </View>
                <Image
                  source={ImageConstants.addAccount}
                  style={styles.inputIconStyle}
                />
              </View>
            </TouchableOpacity>

            {/* Tag Business */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TagBusinessScreen')}
              style={{marginTop: wp(20)}}>
              <Text style={styles.inputTitleStyle}>Add Business</Text>

              <View style={styles.inputParentView}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: wp(13),
                      color: colors.black,
                    }}>
                    {tagBusinessList?.name}
                  </Text>
                </View>
                <Image
                  source={ImageConstants.addAccount}
                  style={styles.inputIconStyle}
                />
              </View>
            </TouchableOpacity>

            {/* Tag Location */}
            <View style={{marginTop: wp(20)}}>
              {/* <Text style={styles.inputTitleStyle}>Add Location</Text> */}

              {/* <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.lightPrimaryColor,
                borderRadius: 5,
              }}>
              <GooglePlacesAutocomplete
                minLength={3} // minimum length of text to search
                placeholder={state?.address == '' ? 'Search' : state.address}
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={true} // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setState(prevState => ({
                    ...prevState,
                    address: data?.description,
                    lat: Number(details?.geometry?.location?.lat),
                    lng: Number(details?.geometry?.location?.lng),
                  }));
                }}
                renderDescription={row => row.description}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
                query={{
                  key: 'AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0',
                  language: 'en',
                }}
                textInputProps={{placeholderTextColor: colors.gray}}
                styles={{
                  textInput: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    color: colors.black,
                  },
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                GoogleReverseGeocodingQuery={{}}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  type: 'cafe',
                }}
                filterReverseGeocodingByTypes={[
                  'locality',
                  'administrative_area_level_3',
                ]}
                debounce={200}
              />
              <Image
                source={ImageConstants.map}
                style={[
                  styles.inputIconStyle,
                  {
                    marginTop: 13,
                  },
                ]}
              />
            </View> */}
              <Text style={styles.inputTitleStyle}>Add Location</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('GetAddress')}
                style={styles.inputParentView}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: wp(13),
                      color: colors.black,
                    }}>
                    {AddAddressValues?.address}
                  </Text>
                </View>
                <Image
                  source={ImageConstants.map}
                  style={styles.inputIconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <CustomButton
              label={
                route?.params?.media_type == 'photo'
                  ? 'Post Image'
                  : 'Post Video'
              }
              isLoading={isLoading}
              onPress={validateFields}
            />
          </View>
          <View style={{height: 70}} />
        </KeyboardAvoidingScrollView>
      </View>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  backButtonStyle: {
    position: 'absolute',
    zIndex: 2,
    marginTop: Platform.OS == 'ios' ? wp(40) : wp(20),
  },

  imageStyle: {
    height: HEIGHT / 2,
    width: WIDTH,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: 'contain',
  },

  inputContainer: {
    margin: wp(20),
  },

  inputTitleStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.black,
  },

  captionInputStyle: {
    textAlignVertical: 'top',
    backgroundColor: colors.lightPrimaryColor,
    padding: wp(10),
    borderRadius: 5,
    height: wp(100),
    marginTop: wp(5),
  },

  video: {
    // alignSelf: 'center',
    width: WIDTH,
    height: HEIGHT / 1.8,
    alignContent: 'center',
  },

  inputParentView: {
    backgroundColor: colors.lightPrimaryColor,
    padding: wp(15),
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputIconStyle: {
    tintColor: colors.primaryColor,
    height: wp(20),
    width: wp(20),
    marginHorizontal: 5,
  },
});

export default MediaReviewScreen;
