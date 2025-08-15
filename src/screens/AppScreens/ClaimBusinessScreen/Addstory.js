import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,SafeAreaView
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import BackHeader from '../../../components/BackHeader';

let pressTimer;

const StoryCaptureScreen = ({route}) => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [recordingTime, setRecordingTime] = useState(0);
const recordingInterval = useRef(null);

const {added_from, business_id} = route?.params
  console.log({added_from, business_id})

  const devices = useCameraDevices();
  // const device = devices[cameraPosition];

  const getBestCameraDevice = (position) => {
    const allDevices = Object.values(devices);
    //  console.log({allDevices})
    return allDevices.find(
      (d) =>
        d.position === position &&
        d.hardwareLevel === 'full' &&
        d.supportsFocus
    );
  };

  const device = getBestCameraDevice(cameraPosition);

  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermission();
    if (cameraStatus !== 'granted') {
      Alert.alert('Camera permission is required');
      return false;
    }

    if (Platform.OS === 'android') {
      const galleryPermission =
        Platform.Version >= 33
          ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO)
          : await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

      if (galleryPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Gallery permission is required');
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
        qualityPrioritization: 'quality',
      });
      navigation.navigate('StoryPreview', { media: { type: 'image', uri: 'file://' + photo.path, 
        added_from, business_id, duration: 5} });
    } catch (err) {
      console.error('Photo capture error:', err);
    }
  };


  const startRecording = async () => {
    if (!cameraRef.current) return;
  
    try {
      setIsRecording(true);
      startRecordingTimer(); // Start the countdown timer
  
      const video = await cameraRef.current.startRecording({
        flash: 'off',
        onRecordingFinished: (video) => {
          console.log({startRecording: video})
          setIsRecording(false);
          stopRecordingTimer(); // Stop timer after recording ends
          navigation.navigate('StoryPreview', {
            media: { type: 'video', uri: 'file://' + video.path, added_from, business_id,
              duration: video.duration, 
             },
          });
        },
        onRecordingError: (error) => {
          setIsRecording(false);
          stopRecordingTimer(); // Stop timer on error too
          console.error('Recording error:', error);
        },
      });
  
      // Auto stop after 30 seconds
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.stopRecording();
          stopRecordingTimer(); // ✅ Add this here
        }
      }, 30000);
    } catch (err) {
      console.error('Start recording error:', err);
      setIsRecording(false);
      stopRecordingTimer(); // just in case error happens early
    }
  };
  
  
  const startRecordingTimer = () => {
    setRecordingTime(0);
    stopRecordingTimer(); 
    recordingInterval.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 30) {
          clearInterval(recordingInterval.current);
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecordingTimer = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setRecordingTime(0);
  };
  

  const handlePressIn = () => {
    pressTimer = setTimeout(() => {
      startRecording();
    }, 200); // Short delay to differentiate tap vs long press
  };

  const handlePressOut = () => {
    clearTimeout(pressTimer);
    stopRecordingTimer();
    if (!isRecording) {
      handleCapture();
    } else {
      cameraRef.current?.stopRecording();
    }
  };

  const pickFromGallery = async () => {
    try {
      const file = await ImagePicker.openPicker({ mediaType: 'any' });
    console.log({file})
      if (file.mime.includes('video')) {
        if (file.duration > 31000) {
          // Show trim option if longer than 30s
          console.log({file})
          // navigation.navigate('TrimScreen', {
          //   uri: file.path,
          //   duration: file.duration,
          // });
          alert('Please select a video of 30 seconds or less.')
        } else {
          navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'video', mediaType : file.mime,
             added_from, business_id,  duration: Math.ceil(file.duration / 1000)} });
        }
      } else {
        navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'image', mediaType : file.mime, 
          added_from, business_id, duration: 5  } });
      }
    } catch (err) {
      console.warn('Gallery pick error:', err);
    }
  };
  
  const toggleCamera = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  if (!device) return <Text style={styles.permissionText}>Waiting for camera...</Text>;

  return (
    <View style={styles.container}>
       <SafeAreaView style={{zIndex:3}}>
           <BackHeader />
       </SafeAreaView>

      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
        photo={true}
      />

{isRecording && (
  <View style={styles.timerContainer}>
    <Text style={styles.timerText}>
      ⏺ {recordingTime.toString().padStart(2, '0')}s
    </Text>
  </View>
)}
      
      <View style={styles.footerContainer}>
  <View style={styles.footerControls}>
    {/* Flip camera button */}
    <TouchableOpacity onPress={() => {
      setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
    }} style={styles.controlButton}>
      <Text style={styles.textWhite}>Flip</Text>
    </TouchableOpacity>

    {/* Capture button */}
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.captureBtn}
    >
      <View style={styles.innerCircle} />
    </TouchableOpacity>

    {/* Gallery button */}
    <TouchableOpacity onPress={pickFromGallery} style={styles.controlButton}>
      <Text style={styles.textWhite}>Gallery</Text>
    </TouchableOpacity>
  </View>
</View>

    </View>
  );
};

export default StoryCaptureScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },

  textWhite: { color: 'white', fontSize: 16 },

  permissionText: { color: 'black', textAlign: 'center', marginTop: 50 },

  footerContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },

  footerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },

  controlButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },

  timerContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  timerText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

