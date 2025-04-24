import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import {colors, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import ImageConstants from '../../../constants/ImageConstants';
import {useDispatch} from 'react-redux';
import {AddAddressAction} from '../../../redux/Slices/AddAddressSlice';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const GetAddress = ({navigation}) => {
  const dispatch = useDispatch();
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

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Add Address" />

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.lightPrimaryColor,
            borderRadius: 5,
            marginHorizontal: 10,
            marginTop: 30,
          }}>
          <GooglePlacesAutocomplete
            minLength={3} // minimum length of text to search
            placeholder={'Search Address'}
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed={true} // true/false/undefined
            fetchDetails={true}
            onPress={(data, details = null) => {
              dispatch(
                AddAddressAction({
                  address: data?.description,
                  lat: Number(details?.geometry?.location?.lat),
                  lng: Number(details?.geometry?.location?.lng),
                  isBusiness: false,
                  placeId: null,
                }),
              );
              navigation.goBack();
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
              {
                tintColor: colors.primaryColor,
                height: wp(20),
                width: wp(20),
                marginHorizontal: 5,
                marginTop: 13,
              },
            ]}
          />
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default GetAddress;
