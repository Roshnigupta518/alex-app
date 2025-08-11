// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   Linking,
//   Alert,
//   ActivityIndicator, 
// } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import Video from 'react-native-video';
// import ImagePicker from 'react-native-image-crop-picker';
// import { ProcessingManager } from 'react-native-video-processing';

// const UploadStoryScreen = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [gallery, setGallery] = useState([]);
//   const [media, setMedia] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const devices = useCameraDevices();
//   const cameraRef = useRef(null);

//   console.log({devices})

//   const getBestCameraDevice = () => {
//     const allDevices = devices?.back ? [devices.back, ...Object.values(devices)] : Object.values(devices);

//     return allDevices.find(
//       (d) =>
//         d.position === 'back' &&
//         d.hardwareLevel === 'full' &&
//         d.supportsFocus &&
//         d.hasTorch
//     );
//   };

//   const device = getBestCameraDevice();

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const cameraStatus = await Camera.requestCameraPermission();
//     let galleryStatus = 'granted';

//     if (Platform.OS === 'android') {
//       try {
//         if (Platform.Version >= 33) {
//           galleryStatus = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//           );
//         } else {
//           galleryStatus = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//           );
//         }
//       } catch (err) {
//         console.warn('Gallery permission error:', err);
//         galleryStatus = 'denied';
//       }
//     }

//     console.log({cameraStatus, galleryStatus})
//     if (cameraStatus === 'granted' && galleryStatus === 'granted') {
//       setHasPermission(true);
//       fetchGallery();
//     } else if (galleryStatus === 'never_ask_again') {
//       Alert.alert(
//         'Permission required',
//         'Please allow gallery permission from settings to access your photos.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Open Settings', onPress: () => Linking.openSettings() },
//         ]
//       );
//     }
//   };

//   const fetchGallery = async () => {
//     const photos = await CameraRoll.getPhotos({ first: 20 });
//     setGallery(photos.edges);
//   };


// const requestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   try {
//     if (Platform.Version >= 33) {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//       );
//       return result === PermissionsAndroid.RESULTS.GRANTED;
//     } else {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       return result === PermissionsAndroid.RESULTS.GRANTED;
//     }
//   } catch (err) {
//     console.warn('Permission error', err);
//     return false;
//   }
// };

//   const takePhoto = async () => {
//     if (!cameraRef.current) {
//       console.warn('Camera ref is null');
//       return;
//     }

//     try {
//       const photo = await cameraRef.current.takePhoto({
//         flash: 'off',
//         qualityPrioritization: 'balanced',
//       });

//       console.log('📸 Photo path:', photo.path);

//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert(
//           'Storage Permission Needed',
//           'Please allow storage permission in settings to save photos.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Open Settings', onPress: () => Linking.openSettings() },
//           ]
//         );
//         return;
//       }

//       const savedUri = await CameraRoll.save(photo.path, { type: 'photo' });
//       console.log('✅ Saved to gallery:', savedUri);
//       setMedia({ uri: savedUri, type: 'image' });
//     } catch (error) {
//       console.error('❌ Failed to take photo:', error);
//     }
//   };

//   const pickMedia = async () => {
//     const file = await ImagePicker.openPicker({ mediaType: 'any' });

//     if (file.mime.includes('video')) {
//       if (file.duration > 30000) {
//         trimVideo(file.path);
//       } else {
//         setMedia({ uri: file.path, type: 'video' });
//       }
//     } else {
//       setMedia({ uri: file.path, type: 'image' });
//     }
//   };

//   const trimVideo = async (path) => {
//     try {
//       const trimmed = await ProcessingManager.trim(path, {
//         startTime: 0,
//         endTime: 30,
//       });
//       setMedia({ uri: trimmed, type: 'video' });
//     } catch (err) {
//       console.error('Video trim error:', err);
//     }
//   };

//   const uploadStory = async () => {
//     if (!media) return;
//     setUploading(true);
//     setTimeout(() => {
//       setUploading(false);
//       setMedia(null);
//       alert('Story uploaded!');
//     }, 2000);
//   };

//   if (!hasPermission) {
//     return <Text style={styles.loadingText}>Waiting for permissions...</Text>;
//   }

//   if (!device) {
//     return <Text style={styles.loadingText}>No compatible camera found.</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={cameraRef}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         photo={true}
//       />

//       <View style={styles.captureContainer}>
//         <TouchableOpacity onPress={()=>takePhoto()} style={styles.captureButton}>
//           <View style={styles.innerCircle} />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={pickMedia} style={styles.pickBtn}>
//         <Text style={styles.pickText}>Pick from Gallery</Text>
//       </TouchableOpacity>

//       {media && (
//         <View style={styles.previewContainer}>
//           {media.type === 'image' ? (
//             <Image source={{ uri: media.uri }} style={styles.preview} />
//           ) : (
//             <Video source={{ uri: media.uri }} style={styles.preview} controls />
//           )}

//           <TouchableOpacity style={styles.submitBtn} onPress={uploadStory}>
//             {uploading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>Upload Story</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       )}

//       <View style={styles.galleryContainer}>
//         <FlatList
//           horizontal
//           data={gallery}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Image
//               source={{ uri: item.node.image.uri }}
//               style={styles.thumbnail}
//             />
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   loadingText: { flex: 1, color: 'black', textAlign: 'center', textAlignVertical: 'center' },
//   captureContainer: { position: 'absolute', bottom: 100, alignSelf: 'center' },
//   captureButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 5,
//     borderColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
//   pickBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: '#444', padding: 10, borderRadius: 8 },
//   pickText: { color: '#fff' },
//   previewContainer: { marginTop: 20, alignItems: 'center' },
//   preview: { width: 300, height: 300, borderRadius: 10 },
//   submitBtn: { marginTop: 20, backgroundColor: '#0099ff', padding: 12, borderRadius: 8 },
//   submitText: { color: '#fff' },
//   galleryContainer: { position: 'absolute', bottom: 10, width: '100%' },
//   thumbnail: { width: 60, height: 60, marginHorizontal: 6, borderRadius: 6 },
// });

// export default UploadStoryScreen;



// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { useNavigation } from '@react-navigation/native';
// import ImagePicker from 'react-native-image-crop-picker';
// import { ProcessingManager } from 'react-native-video-processing';

// const UploadStoryScreen = () => {
//   const cameraRef = useRef(null);
//   const navigation = useNavigation();
//   const devices = useCameraDevices();
//   const [hasPermission, setHasPermission] = useState(false);
//   // const device = devices.back;

//     const getBestCameraDevice = () => {
//     const allDevices = devices?.back ? [devices.back, ...Object.values(devices)] : Object.values(devices);

//     return allDevices.find(
//       (d) =>
//         d.position === 'back' &&
//         d.hardwareLevel === 'full' &&
//         d.supportsFocus &&
//         d.hasTorch
//     );
//   };

//   const device = getBestCameraDevice();

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const cameraPermission = await Camera.requestCameraPermission();
//     const micPermission = await Camera.requestMicrophonePermission();

//     let storagePermission = true;

//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 33) {
//         const res = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         ]);
//         storagePermission =
//           res[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === 'granted' &&
//           res[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'granted';
//       } else {
//         const res = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//         );
//         storagePermission = res === 'granted';
//       }
//     }

//     console.log({cameraPermission, micPermission, storagePermission})

//     if (cameraPermission === 'granted' && micPermission === 'granted' && storagePermission) {
//       setHasPermission(true);
//     } else {
//       Alert.alert('Permissions Required', 'Camera/Microphone/Storage permissions are needed.');
//     }
//   };

//   const recordVideo = async () => {
//     if (!cameraRef.current) return;

//     try {
//       const video = await cameraRef.current.startRecording({
//         onRecordingFinished: (video) => {
//           navigation.navigate('StoryPreview', { media: { uri: video.path, type: 'video' } });
//         },
//         onRecordingError: (err) => {
//           console.error('Recording error:', err);
//         },
//       });

//       setTimeout(() => {
//         cameraRef.current.stopRecording();
//       }, 30000); // auto-stop at 30 seconds
//     } catch (error) {
//       console.error('Record error:', error);
//     }
//   };

//   const takePhoto = async () => {
//     if (!cameraRef.current) return;

//     try {
//       const photo = await cameraRef.current.takePhoto({ flash: 'off' });
//       navigation.navigate('StoryPreview', { media: { uri: photo.path, type: 'image' } });
//     } catch (error) {
//       console.error('Photo error:', error);
//     }
//   };

//   const pickMedia = async () => {
//     try {
//       const file = await ImagePicker.openPicker({ mediaType: 'any' });

//       if (file.mime.includes('video')) {
//         if (file.duration > 30000) {
//           const trimmed = await ProcessingManager.trim(file.path, { startTime: 0, endTime: 30 });
//           navigation.navigate('StoryPreview', { media: { uri: trimmed, type: 'video' } });
//         } else {
//           navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'video' } });
//         }
//       } else {
//         navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'image' } });
//       }
//     } catch (err) {
//       console.log('Media pick error:', err);
//     }
//   };

//   if (!hasPermission || !device) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.text}>Waiting for camera/permission...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={cameraRef}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         photo={true}
//         video={true}
//         audio={true}
//       />
//       {/* <View style={styles.controls}>
//         <TouchableOpacity onPress={takePhoto} style={styles.btn}>
//           <Text style={styles.btnText}>📸</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={recordVideo} style={styles.btn}>
//           <Text style={styles.btnText}>🎥</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={pickMedia} style={styles.btn}>
//           <Text style={styles.btnText}>📁</Text>
//         </TouchableOpacity>
//       </View> */}

// <View style={styles.captureWrapper}>
//         <TouchableOpacity
//           style={styles.captureButton}
//           onPress={handleTakePhoto}
//           onLongPress={handleStartRecording}
//           onPressOut={handleStopRecording}
//         >
//           <Animated.View
//             style={[
//               styles.innerCircle,
//               {
//                 width: progress.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [60, 80],
//                 }),
//                 height: progress.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [60, 80],
//                 }),
//               },
//             ]}
//           />
//         </TouchableOpacity>

//         {isRecording && (
//           <Animated.View
//             style={[
//               styles.progressBar,
//               {
//                 width: progress.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: ['0%', '100%'],
//                 }),
//               },
//             ]}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   text: { color: '#fff' },
//   controls: {
//     position: 'absolute',
//     bottom: 40,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//   },
//   btn: {
//     backgroundColor: '#00000088',
//     padding: 15,
//     borderRadius: 50,
//   },
//   btnText: { fontSize: 20, color: '#fff' },
// });

// export default UploadStoryScreen;



// StoryCaptureScreen.js
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
      navigation.navigate('StoryPreview', { media: { type: 'image', uri: 'file://' + photo.path, added_from, business_id } });
    } catch (err) {
      console.error('Photo capture error:', err);
    }
  };

  // const startRecording = async () => {
  //   if (!cameraRef.current) return;

  //   try {
  //     setIsRecording(true);
  //     startRecordingTimer();
  //     const video = await cameraRef.current.startRecording({
  //       flash: 'off',
  //       onRecordingFinished: (video) => {
  //         setIsRecording(false);
  //         navigation.navigate('StoryPreview', { media: { type: 'video', uri: 'file://' + video.path } });
  //       },
  //       onRecordingError: (error) => {
  //         setIsRecording(false);
  //         console.error('Recording error:', error);
  //       },
  //     });

  //     // Stop after 30 seconds
  //     setTimeout(() => {
  //       if (cameraRef.current) {
  //         cameraRef.current.stopRecording();
  //       }
  //     }, 30000);
  //   } catch (err) {
  //     console.error('Start recording error:', err);
  //     setIsRecording(false);
  //   }
  // };

  
  const startRecording = async () => {
    if (!cameraRef.current) return;
  
    try {
      setIsRecording(true);
      startRecordingTimer(); // Start the countdown timer
  
      const video = await cameraRef.current.startRecording({
        flash: 'off',
        onRecordingFinished: (video) => {
          setIsRecording(false);
          stopRecordingTimer(); // Stop timer after recording ends
          navigation.navigate('StoryPreview', {
            media: { type: 'video', uri: 'file://' + video.path, added_from, business_id },
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
        if (file.duration > 30000) {
          // Show trim option if longer than 30s
          console.log({file})
          // navigation.navigate('TrimScreen', {
          //   uri: file.path,
          //   duration: file.duration,
          // });
          alert('Please select a video of 30 seconds or less.')
        } else {
          navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'video', mediaType : file.mime, added_from, business_id} });
        }
      } else {
        navigation.navigate('StoryPreview', { media: { uri: file.path, type: 'image', mediaType : file.mime, added_from, business_id} });
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
           <BackHeader  />
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

