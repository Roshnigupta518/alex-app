import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import {
  BusinessUserInputs,
  BusinessUserDescriptionInput,
  BusinessImagePicker,
} from '../commonComponents/BusinessUserInputs';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import CustomButton from '../../../components/CustomButton';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import BusinessValidation from './BusinessValidation';
import {
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const AddBusinessScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [businessImage, setBusinessImage] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
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

  const [state, setState] = useState({
    businessName: '',
    address: '',
    lat: null,
    lng: null,
    phn: '',
    desc: '',
    city: '',
    state: '',
    country: '',
    website:'',
    instagram: '',
    twitter: '',
    tiktok: '',
    facebook: '',
    youtube: '',
    e_commerce:''
  });

  useEffect(() => {
    if (route?.params?.isEdit) {
      let {data} = route?.params;

      setState(prevState => ({
        ...prevState,
        businessName: data?.name,
        address: data?.address,
        lat: data?.latitude,
        lng: data?.longitude,
        phn: data?.phone_no.replace('+', ''),
        desc: data?.details,
        city: data?.city,
        state: data?.state,
        country: data?.country,
      }));
    }
  }, []);

  const UpdateBusiness = () => {
    if (
      !BusinessValidation(
        state.businessName,
        state.address,
        state.lat,
        state.lng,
        state.phn,
        state.desc,
        'skip-image',
        'skip-image',
        'skip-image',
      )
    ) {
      return;
    } else {
      setIsLoading(true);
      let data = new FormData();
      data.append('name', state.businessName);
      data.append('phone_no', '+' + state.phn?.replace('+', ''));
      data.append('details', state.desc);
      data.append('address', state.address);
      data.append('category_id', route.params?.data?.category_id);
      data.append('sub_category_id', route?.params?.data?.sub_category_id);
      data.append('longitude', state.lng);
      data.append('latitude', state.lat);
      data.append('city', 'xx');
      data.append('state', 'xx');
      data.append('country', 'xx');
      // data.append('country', state.country);
      // data.append('state', state.state);
      // data.append('city', state.city);

      if (bannerImage != null) {
        data.append('banner', bannerImage);
      }
      if (businessImage != null) {
        data.append('image', businessImage);
      }
      if (certificateImage != null) {
        data.append('certificate', certificateImage);
      }

      UpdateBusinessRequest(route?.params?.data?._id, data)
        .then(res => {
          navigation.goBack();
          Toast.success('Business', res?.message);
        })
        .catch(err => {
          console.log('err', err?.message);
          Toast.error('Business', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const SubmitBusiness = () => {
    if (
      !BusinessValidation(
        state.businessName?.trim(),
        state.address,
        state.lat,
        state.lng,
        state.phn,
        state.desc?.trim(),
        businessImage,
        bannerImage,
        certificateImage,
      )
    ) {
      return;
    } else {
      setIsLoading(true);
      let data = new FormData();
      data.append('certificate', certificateImage);
      data.append('banner', bannerImage);
      data.append('image', businessImage);
      data.append('name', state.businessName);
      data.append('phone_no', state.phn);
      data.append('details', state.desc);
      data.append('address', state.address);
      data.append('category_id', route.params?.catId);
      data.append('sub_category_id', route?.params?.subCatId);
      data.append('longitude', state.lng);
      data.append('latitude', state.lat);
      data.append('city', 'xx');
      data.append('state', 'xx');
      data.append('country', 'xx');
      if (route?.params?.childId != undefined) {
        data.append('sub_child_category_id', route?.params?.childId);
      }

      CreateBusinessRequest(data)
        .then(res => {
          try {
            navigation.navigate('BusinessUserListingScreen');
          } catch (err) {
            Toast.error('Navigation', 'Something went wrong!');
          }
          Toast.success('Business', res?.message);
        })
        .catch(err => {
          console.log(err);
          Toast.error('Business', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <BackHeader label="Register Your Business" />

      <View
        style={{
          padding: wp(20),
          flex: 1,
        }}>
        <KeyboardAvoidingScrollView
          behavior={Platform.OS == 'android' ? 'height' : 'padding'}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}>
          <BusinessUserInputs
            theme="light"
            label="Add Business Name"
            placeholder="Write here"
            value={state.businessName}
            onChangeText={txt =>
              setState(prevState => ({...prevState, businessName: txt}))
            }
          />

          <View
            style={{
              marginBottom: wp(13),
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: wp(15),
                color: colors.black,
              }}>
              Add Address
            </Text>
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
                  city:
                    data?.terms?.length > 0
                      ? data?.terms[data?.terms?.length - 3]?.value
                      : '',
                  state:
                    data?.terms?.length > 0
                      ? data?.terms[data?.terms?.length - 2]?.value
                      : '',
                  country:
                    data?.terms?.length > 0
                      ? data?.terms[data?.terms?.length - 1]?.value
                      : '',
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
                  backgroundColor: colors.lightPrimaryColor,
                  marginTop: 6,
                  borderRadius: 7,
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
          </View>

          <BusinessUserInputs
            theme="light"
            label="Add Phone Number"
            keyboardType="number-pad"
            placeholder="Write here"
            value={state.phn}
            onChangeText={txt =>
              setState(prevState => ({...prevState, phn: txt}))
            }
          />

          <BusinessUserDescriptionInput
            theme="light"
            label="Add Business Description"
            placeholder="Write here"
            value={state.desc}
            onChangeText={txt =>
              setState(prevState => ({...prevState, desc: txt}))
            }
          />

          {/* <BusinessImagePicker
            extraImage={
              route?.params?.data?.image?.length > 0
                ? route?.params?.data?.image[0]
                : ''
            }
            theme="light"
            label="Add photos of your Business"
            image={businessImage}
            getImageFile={res => setBusinessImage(res)}
          /> */}

          <BusinessUserInputs
            theme="light"
            label="Add Webiste Link"
            placeholder="Write here"
            value={state.website}
            onChangeText={txt =>
              setState(prevState => ({...prevState, website: txt}))
            }
          />

        <BusinessUserInputs
            theme="light"
            label="Add your e-commerce website link"
            placeholder="Write here"
            value={state.e_commerce}
            onChangeText={txt =>
              setState(prevState => ({...prevState, e_commerce: txt}))
            }
          />

          {/* ------------------- */}

          <BusinessUserInputs
            theme="light"
            label="Add Tiktok Link"
            placeholder="Write here"
            value={state.tiktok}
            onChangeText={txt =>
              setState(prevState => ({...prevState, tiktok: txt}))
            }
          />

         <BusinessUserInputs
            theme="light"
            label="Add Instagram Link"
            placeholder="Write here"
            value={state.instagram}
            onChangeText={txt =>
              setState(prevState => ({...prevState, instagram: txt}))
            }
          />
          <BusinessUserInputs
            theme="light"
            label="Add Youtube Link"
            placeholder="Write here"
            value={state.youtube}
            onChangeText={txt =>
              setState(prevState => ({...prevState, youtube: txt}))
            }
          />
          <BusinessUserInputs
            theme="light"
            label="Add Facebook Link"
            placeholder="Write here"
            value={state.facebook}
            onChangeText={txt =>
              setState(prevState => ({...prevState, facebook: txt}))
            }
          />
          <BusinessUserInputs
            theme="light"
            label="Add X Link"
            placeholder="Write here"
            value={state.twitter}
            onChangeText={txt =>
              setState(prevState => ({...prevState, twitter: txt}))
            }
          />
         {/* ----------------------- */}


          <BusinessImagePicker
            extraImage={route?.params?.data?.certificate || ''}
            theme="light"
            label="Upload Business Logo"
            image={certificateImage}
            getImageFile={res => setCertificateImage(res)}
          />

          <BusinessImagePicker
            extraImage={route?.params?.data?.banner || ''}
            theme="light"
            label="Upload Business Banner"
            image={bannerImage}
            getImageFile={res => setBannerImage(res)}
          />
        </KeyboardAvoidingScrollView>
      </View>

      <View style={{marginBottom: 15}}>
        <CustomButton
          isLoading={isLoading}
          disabled={isLoading}
          label="Save Details"
          onPress={route?.params?.isEdit ? UpdateBusiness : SubmitBusiness}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddBusinessScreen;
