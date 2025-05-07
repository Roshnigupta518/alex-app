import { useEffect, useState, useRef } from 'react';
import { Platform, Alert, PermissionsAndroid, AppState, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

const GOOGLE_API_KEY = 'AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0'; // Replace

const useCheckLocation = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const appState = useRef(AppState.currentState);

  const getCityFromCoords = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      const components = data.results[0]?.address_components || [];
      const cityComp = components.find(comp =>
        comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
      );
      const cityName = cityComp?.long_name || 'Unknown';
      if (city !== cityName) setCity(cityName);
    } catch (err) {
      console.error('City fetch error:', err);
      setError('Unable to fetch city');
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
        // Alert.alert('Permission Required', 'Please enable location permission in your settings.');
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your settings',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return false;
      } else {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        let result = await check(permission);
        if (result === RESULTS.DENIED) result = await request(permission);
        if (result === RESULTS.GRANTED) return true;
        // Alert.alert('Permission Required', 'Please enable location access in your iPhone settings.');
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your iPhone settings',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return false;
      }
    } catch (e) {
      console.error('Permission error:', e);
      return false;
    }
  };

  const checkGPS = async () => {
    const isEnabled = await DeviceInfo.isLocationEnabled();
    if (!isEnabled) {
      Alert.alert('Location Off', 'Please turn on GPS (Location Services) from phone settings.');
    }
    return isEnabled;
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        const isNew =
          !location ||
          location.latitude !== latitude ||
          location.longitude !== longitude;

        if (isNew) {
          setLocation(newLocation);
          getCityFromCoords(latitude, longitude);
          setError(null);
        }
      },
      err => {
        console.error('Geolocation error:', err);
        setError(err.message || 'Failed to get location');
      }
      // ,
      // {
      //   enableHighAccuracy: true,
      //   timeout: 15000,
      //   maximumAge: 10000,
      // }
    );
  };

  const init = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location Permission denied');
      return;
    }

    const isGPSEnabled = await checkGPS();
    if (!isGPSEnabled) {
      setError('GPS is turned off');
      return;
    }

    if (!location) {
      fetchLocation();
    }
  };

  useEffect(() => {
    init();

    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const isGPSEnabled = await DeviceInfo.isLocationEnabled();
        if (isGPSEnabled && !location) {
          fetchLocation();
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return { location, city, error };
};

export default useCheckLocation;
