import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
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
import ImageConstants from '../../../constants/ImageConstants';
import DateSheet from '../commonComponents/DateSheet';
import TimeSheet from '../commonComponents/TimeSheet';
import Toast from '../../../constants/Toast';
import EventValidation from './EventValidation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {CreateEventRequest} from '../../../services/Utills';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
import CustomContainer from '../../../components/container';

const AddEventScreen = ({navigation}) => {
  const dateRef = useRef();
  const timeRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [eventImage, setEventImage] = useState(null);
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
    event_name: '',
    address: '',
    phone: '',
    description: '',
    fee: '',
    location: '',
    lat: null,
    lng: null,
    showLocation: '',
  });

  const SubmitEvent = () => {
    if (
      !EventValidation(
        logoImage,
        state.event_name,
        state.phone,
        state.description?.trim(),
        eventDate,
        eventTime,
        eventImage,
        state.fee,
        state.location,
        state.lat,
        state.lng,
      )
    ) {
      return;
    } else {
      setIsLoading(true);

      let data = new FormData();
      data.append('title', state.event_name);
      data.append('description', state.description);
      data.append('location', state.location);
      data.append('date', moment(eventDate, 'YYYY-MM-DD').format('DD-MM-YYYY'));
      data.append('time', eventTime);
      data.append('latitude', state.lat);
      data.append('longitude', state.lng);
      data.append('phone', '+' + state.phone?.replace('+', ''));
      data.append('entry_fee', state.fee);
      data.append('image', eventImage);
      data.append('logo', logoImage);
      CreateEventRequest(data)
        .then(res => {
          Toast.success('Event', res?.message);
          navigation.goBack();
        })
        .catch(err => {
          Toast.error('Event', err?.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  function getTimeDifferenceInHours(time1, time2) {
    // Parse the time strings into moment objects with a common date
    const momentTime1 = moment(time1, 'hh:mm A');
    const momentTime2 = moment(time2, 'hh:mm A');

    // Calculate the difference in hours
    const differenceInHours = momentTime2.diff(momentTime1, 'hours', true);

    return differenceInHours;
  }

  return (
    <>
      <CustomContainer>
        <BackHeader label="Events" />

        <View
          style={{
            padding: wp(20),
            flex: 1,
          }}>
          <KeyboardAvoidingScrollView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            showsVerticalScrollIndicator={false}>
            <BusinessImagePicker
              label="Add a symbol of your organization."
              image={logoImage}
              theme="light"
              getImageFile={res => setLogoImage(res)}
            />

            <BusinessUserInputs
              label="Add Event Name"
              placeholder="Write here"
              theme="light"
              value={state.event_name}
              onChangeText={txt =>
                setState(prevState => ({...prevState, event_name: txt}))
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
                placeholder="Search"
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={true} // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setState(prevState => ({
                    ...prevState,
                    location: data?.description,
                    showLocation: data?.description,
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
                    backgroundColor: colors.lightPrimaryColor,
                    // borderWidth: 1,
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
              label="Add Phone Number"
              placeholder="Write here"
              keyboardType={'number-pad'}
              maxlenght={15}
              theme="light"
              value={state.phone}
              onChangeText={txt =>
                setState(prevState => ({...prevState, phone: txt}))
              }
            />

            <BusinessUserDescriptionInput
              label="Add Event Description"
              placeholder="Write here"
              value={state.description}
              theme="light"
              onChangeText={txt =>
                setState(prevState => ({...prevState, description: txt}))
              }
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: wp(13),
              }}>
              <TouchableOpacity
                onPress={() => dateRef.current?.show()}
                style={{
                  padding: wp(10),
                  backgroundColor: colors.lightPrimaryColor,
                  flex: 0.47,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: wp(13),
                    color: colors.black,
                  }}>
                  {eventDate ? eventDate : 'Event Date'}
                </Text>

                <Image
                  source={ImageConstants.calendar}
                  style={{
                    tintColor: colors.primaryColor,
                    height: wp(20),
                    width: wp(20),
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => timeRef.current?.show()}
                style={{
                  padding: wp(10),
                  backgroundColor: colors.lightPrimaryColor,
                  flex: 0.47,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: wp(13),
                    color: colors.black,
                  }}>
                  {eventTime ? eventTime : 'Select Time'}
                </Text>

                <Image
                  source={ImageConstants.timer}
                  style={{
                    tintColor: colors.primaryColor,
                    height: wp(20),
                    width: wp(20),
                  }}
                />
              </TouchableOpacity>
            </View>

            <BusinessImagePicker
              label="Add photos of your Events"
              image={eventImage}
              theme="light"
              getImageFile={res => setEventImage(res)}
            />

            <BusinessUserInputs
              label="Add Entry Fee"
              placeholder="Write here"
              value={state.fee}
              theme="light"
              keyboardType="number-pad"
              onChangeText={txt => {
                let txtData = txt?.replace(/[-&.,]/g, '').trim();
                setState(prevState => ({
                  ...prevState,
                  fee: txtData,
                }));
              }}
            />
          </KeyboardAvoidingScrollView>

          <TimeSheet
            ref={timeRef}
            onSuccess={res => {
              console.log(res);
              if (eventDate != null) {
                if ((eventDate, res)) {
                  let todayDate = new Date();
                  const hoursDifference = getTimeDifferenceInHours(
                    moment().format('hh:mm a'),
                    res,
                  );
                  if (
                    (hoursDifference >= 0 &&
                      moment(eventDate).format('DD-YY-YYYY') ==
                        moment(todayDate?.toISOString()).format(
                          'DD-YY-YYYY',
                        )) ||
                    moment(eventDate).format('DD-YY-YYYY') !=
                      moment(todayDate?.toISOString()).format('DD-YY-YYYY')
                  ) {
                    setEventTime(res);
                  } else {
                    Toast.error('Time', 'Time and should be upcoming time.');
                  }
                }
              } else {
                Toast.error('Date', 'Please select date first.');
              }
            }}
          />
          <DateSheet ref={dateRef} onSuccess={res => setEventDate(res)} />
        </View>

        <View
          style={{
            marginBottom: 15,
          }}>
          <CustomButton
            isLoading={isLoading}
            disabled={isLoading}
            label="Save Details"
            onPress={SubmitEvent}
          />
        </View>
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default AddEventScreen;
