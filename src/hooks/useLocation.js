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
  const [permissionGranted, setPermissionGranted] = useState(false);
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

  const checkLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        console.log('Location permission granted.');
        setPermissionGranted(true);
        return true;
      }

      console.log('Location permission denied. Skipping location-based logic.');
      setPermissionGranted(false);
      setError('Location Permission denied.\nTo see current location related content please enable location permission in your settings');
      return false;
    } catch (err) {
      console.error('Error checking permission:', err);
      setError('Error checking location permission');
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          return true;
        }

        setPermissionGranted(false);
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else {
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        let result = await check(permission);
        if (result === RESULTS.DENIED) result = await request(permission);

        if (result === RESULTS.GRANTED) {
          setPermissionGranted(true);
          return true;
        }

        setPermissionGranted(false);
        Alert.alert(
          'Location Permission Denied',
          'Please enable location access in your iPhone settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    } catch (e) {
      console.error('Permission error:', e);
      setError('Error requesting location permission');
      setPermissionGranted(false);
      return false;
    }
  };

  const checkGPS = async () => {
    const isEnabled = await DeviceInfo.isLocationEnabled();
    if (!isEnabled) {
      // Alert.alert('Location Off', 'Please turn on GPS (Location Services) from phone settings.');
      setError('To see posts near you, please turn on GPS (Location Services)');
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
    );
  };

  const init = async () => {
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      console.log('Skipping location logic as permission denied.');
      return;
    }

    const isGPSEnabled = await checkGPS();
    if (!isGPSEnabled) return;

    if (!location) {
      fetchLocation();
    }
  };

  const refreshLocation = async () => {
    const isGPSEnabled = await DeviceInfo.isLocationEnabled();
    if (!isGPSEnabled) {
      setError('To see posts near you, please turn on GPS (Location Services)');
      return;
    }
  
    if (!permissionGranted) {
      setError('Location permission not granted');
      return;
    }
  
    fetchLocation();
  };

  useEffect(() => {
    init();

    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const isGPSEnabled = await DeviceInfo.isLocationEnabled();
        if (isGPSEnabled && permissionGranted && !location) {
          fetchLocation();
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return { location, city, error, permissionGranted, refreshLocation };
};

export default useCheckLocation;
