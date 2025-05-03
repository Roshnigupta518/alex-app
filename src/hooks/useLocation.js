// useLocation.js
import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
const GOOGLE_API_KEY = 'AIzaSyAbFHI5aGGL3YVP0KvD9nDiFKsi_cX3bS0'
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
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
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
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocation();
  }, []);

  return { location, city, error };
};

export default useLocation;
