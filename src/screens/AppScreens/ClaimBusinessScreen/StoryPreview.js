import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator, SafeAreaView, Platform, TextInput, ScrollView
} from 'react-native';
import Video from 'react-native-video';
import BackHeader from '../../../components/BackHeader';
import { colors } from '../../../constants';
import { api, BASE_URL } from '../../../services/WebConstants';
import Storage from '../../../constants/Storage';
import Toast from '../../../constants/Toast';
import useCheckLocation from '../../../hooks/useLocation';
import CustomButton from '../../../components/CustomButton';
import { wp, fonts } from '../../../constants';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useSelector, useDispatch } from 'react-redux';
import ImageConstants from '../../../constants/ImageConstants';
import { clearBusinessAction } from '../../../redux/Slices/TagBusinessSlice';

const StoryPreview = ({ route, navigation }) => {
  const { media } = route.params;
  const [uploading, setUploading] = React.useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState();
  const [caption, setCaption] = useState('');
  const [locationState, setLocationState] = useState({
    name: '',
    place_id: '',
  });
  const tagBusinessList = useSelector(state => state.TagBusinessSlice?.data);

  // console.log({ media })
  const businessItem = route?.params?.businessItem

  const { location } = useCheckLocation()
  const dispatch = useDispatch()

  const getFileNameFromPath = (path) => {
    return path.split('/').pop(); // last part after last slash
  };

  // Detect correct MIME type from file extension
  const getMimeTypeFromUri = (uri) => {
    const extension = uri.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      default:
        return 'application/octet-stream'; // fallback
    }
  };

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(media?.uri, { time: 2000 });

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

  useEffect(() => {
    if (media?.type !== 'image') {
      generateThumbnail();
    }
  }, [media]);

  useEffect(()=>{
    let id = tagBusinessList?._id || tagBusinessList?.place_id || businessItem?.place_id || businessItem?._id;
    setLocationState(prevState => ({
      ...prevState,
      place_id: id,
      name: tagBusinessList?.name || businessItem?.name,
    }));
  },[tagBusinessList])

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("type", media.type === 'image' ? 1 : 2);
      formdata.append("caption", caption);
      formdata.append("latitude", location?.latitude || 0);
      formdata.append("longitude", location?.longitude || 0);
      formdata.append("mediafile", {
        uri: Platform.OS === "ios"
          ? media.uri.replace("file://", "")
          : media.uri,
        type: getMimeTypeFromUri(media.uri),
        name: getFileNameFromPath(media.uri) || `video_${Date.now()}.mp4`
      });
      formdata.append("added_from", media.added_from);
      formdata.append("duration", media.duration);
      if (
        locationState?.place_id != undefined &&
        locationState?.place_id != ''
      ) {
        formdata.append(
          'tagBussiness',
          JSON.stringify({
            place_id: locationState?.place_id,
            name: locationState?.name,
          }),
        );
      }

      { media.business_id && formdata.append("business_id", media.business_id) }

      if (videoThumbnail != null) {
        formdata.append('strory_thumbnail', videoThumbnail);
      }

      let temp_token = await Storage.get('userdata');

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: 'Bearer ' + temp_token?.token
        },
        body: formdata,
      };

      const url = BASE_URL + api.addStory;
      console.log({ url, formdata: JSON.stringify(formdata) });

      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log({ result });

      if (result?.status) {
        setLocationState({
          name: '',
          place_id: '',
        })
        dispatch(clearBusinessAction())
        Toast.success('Story', result?.message);
        navigation.navigate('Home', { shouldScrollTopReel: true });
      } else {
        Toast.error('Story', result?.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  // return (
  //   <View style={styles.flex}>
  //     <SafeAreaView style={{ zIndex: 3, position: 'absolute' }}>
  //       <BackHeader />
  //     </SafeAreaView>
  //     <ScrollView style={{flex:1}}>
  //     <View style={styles.container}>

  //       {media.type === 'image' ? (
  //         <Image source={{ uri: media.uri }} style={styles.preview} />
  //       ) : (
  //         <Video
  //           source={{ uri: media.uri }}
  //           style={styles.preview}
  //           controls
  //           resizeMode="contain"
  //         />
  //       )}

  //     </View>
          
  //           <View>
  //             <Text style={styles.inputTitleStyle}>Add Caption</Text>

  //             <TextInput
  //               style={styles.captionInputStyle}
  //               multiline={true}
  //               placeholder="Write your caption..."
  //               value={caption}
  //               onChangeText={txt => setCaption(txt)}
  //             />
  //           </View>

  //           {/* Tag Business */}
  //           <TouchableOpacity 
  //             disabled={businessItem? true : false}
  //             onPress={() => navigation.navigate('TagBusinessScreen')}
  //             style={{marginTop: wp(20)}}>
  //             <Text style={styles.inputTitleStyle}>Add Business</Text>

  //             <View style={styles.inputParentView}>
  //               <View style={{flex: 1}}>
  //                 <Text
  //                   style={{
  //                     fontFamily: fonts.regular,
  //                     fontSize: wp(13),
  //                     color: colors.black,
  //                   }}>
  //                   {/* {tagBusinessList?.name} */}
  //                   {locationState?.name}
  //                 </Text>
  //               </View>
  //               <Image
  //                 source={ImageConstants.addAccount}
  //                 style={styles.inputIconStyle}
  //               />
  //             </View>
  //           </TouchableOpacity>

  //     <View style={{ margin: 20 }}>
  //       <CustomButton
  //         label="Upload"
  //         onPress={handleUpload}
  //         isLoading={uploading}
  //         disabled={uploading}
  //       />
  //     </View>
  //     </ScrollView>
  //   </View>
  // );

  return (
    <View style={styles.flex}>
      {/* Header */}
      <SafeAreaView style={{ position: 'absolute', zIndex: 3 }}>
        <BackHeader />
      </SafeAreaView>
  
      {/* Media Preview */}
      <View style={styles.previewContainer}>
        {media.type === 'image' ? (
          <Image source={{ uri: media.uri }} style={styles.preview} resizeMode="contain" />
        ) : (
          <Video
            source={{ uri: media.uri }}
            style={styles.preview}
            controls
            resizeMode="contain"
          />
        )}
      </View>
  
      {/* Scrollable Content */}
      <ScrollView
        style={styles.bottomSheet}
        contentContainerStyle={{ paddingBottom: wp(120) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Caption */}
        <Text style={styles.inputTitleStyle}>Add Caption</Text>
        <TextInput
          style={styles.captionInputStyle}
          multiline
          placeholder="Write your caption..."
          value={caption}
          onChangeText={txt => setCaption(txt)}
          maxLength={500}
        />
  
        {/* Tag Business */}
        <TouchableOpacity
          disabled={!!businessItem}
          onPress={() => navigation.navigate('TagBusinessScreen')}
          style={{ marginTop: wp(20) }}
        >
          <Text style={styles.inputTitleStyle}>Tag Business</Text>
  
          <View style={styles.inputParentView}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: wp(13),
                  color: colors.black,
                }}
                numberOfLines={1}
              >
                {locationState?.name || "Select Business"}
              </Text>
            </View>
            <Image
              source={ImageConstants.addAccount}
              style={styles.inputIconStyle}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
  
      {/* Bottom Upload Button */}
      <View style={styles.uploadContainer}>
        <CustomButton
          label="Upload"
          onPress={handleUpload}
          isLoading={uploading}
          disabled={uploading}
        />
      </View>
    </View>
  );
  
};

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//     backgroundColor: colors.black
//   },
//   container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
//   preview: { width: '90%', height: '80%', },
//   uploadBtn: {
//     marginTop: 30,
//     backgroundColor: '#0099ff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   uploadText: { color: '#fff', fontSize: 16 },
//   captionInputStyle: {
//     textAlignVertical: 'top',
//     backgroundColor: colors.lightPrimaryColor,
//     padding: wp(10),
//     borderRadius: 5,
//     height: wp(100),
//     marginTop: wp(5),
//   },
//   inputParentView: {
//     backgroundColor: colors.lightPrimaryColor,
//     padding: wp(15),
//     marginTop: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   inputTitleStyle: {
//     fontFamily: fonts.semiBold,
//     fontSize: wp(16),
//     color: colors.black,
//   },
//   inputIconStyle: {
//     tintColor: colors.primaryColor,
//     height: wp(20),
//     width: wp(20),
//     marginHorizontal: 5,
//   },
// });

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.black,
  },
  previewContainer: {
    flex: 0.6, // 60% of screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    flex: 0.4, // 40% of screen
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: wp(15),
  },
  captionInputStyle: {
    textAlignVertical: 'top',
    backgroundColor: colors.lightPrimaryColor,
    padding: wp(10),
    borderRadius: 5,
    height: wp(100),
    marginTop: wp(5),
  },
  inputParentView: {
    backgroundColor: colors.lightPrimaryColor,
    padding: wp(15),
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
  },
  inputTitleStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.black,
    marginTop: wp(10),
  },
  inputIconStyle: {
    tintColor: colors.primaryColor,
    height: wp(20),
    width: wp(20),
    marginLeft: 8,
  },
  uploadContainer: {
    position: 'absolute',
    bottom: wp(20),
    left: wp(15),
    right: wp(15),
  },
});


export default StoryPreview;
