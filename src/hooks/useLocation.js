import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const GOOGLE_API_KEY = 'AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);

  const getCityFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      const addressComponents = data.results[0]?.address_components;

      const cityComponent = addressComponents?.find(comp =>
        comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
      );

      setCity(cityComponent?.long_name || 'Unknown');
      setError(null);
    } catch (err) {
      console.error('Error fetching city:', err);
      setError('Failed to fetch city');
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

        Alert.alert(
          'Location Permission Required',
          'Please enable location permission from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        let result = await check(permission);

        if (result === RESULTS.DENIED) {
          result = await request(permission);
        }

        if (result === RESULTS.GRANTED) return true;

        Alert.alert(
          'Location Permission Required',
          'Please enable location access from iOS Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        return false;
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      return false;
    }
  };

  const promptToEnableLocation = () => {
    Alert.alert(
      'Location Service Off',
      'Please turn on location services to get your current location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
  };

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          getCityFromCoords(latitude, longitude);
        },
        (err) => {
          if (
            err.code === 1 // permission denied
          ) {
            setError('Location permission denied');
          } else if (
            err.code === 2 || // position unavailable
            err.code === 3 // timeout
          ) {
            promptToEnableLocation();
            setError('Location services might be off');
          } else {
            setError(err.message);
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }, []);

  return { location, city, error };
};

export default useLocation;
