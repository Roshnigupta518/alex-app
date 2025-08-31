import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator, SafeAreaView, Platform
} from 'react-native';
import Video from 'react-native-video';
import BackHeader from '../../../components/BackHeader';
import { colors } from '../../../constants';
import { api, BASE_URL } from '../../../services/WebConstants';
import Storage from '../../../constants/Storage';
import Toast from '../../../constants/Toast';
import useCheckLocation from '../../../hooks/useLocation';
import CustomButton from '../../../components/CustomButton';
import { wp } from '../../../constants';
import * as VideoThumbnails from 'expo-video-thumbnails';

const StoryPreview = ({ route, navigation }) => {
  const { media } = route.params;
  const [uploading, setUploading] = React.useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState();

  console.log({ media })

  const { location } = useCheckLocation()

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

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formdata = new FormData();
      formdata.append("type", media.type === 'image' ? 1 : 2);
      formdata.append("caption", "xyz");
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

  return (
    <View style={styles.flex}>
      <SafeAreaView style={{ zIndex: 3, position: 'absolute' }}>
        <BackHeader />
      </SafeAreaView>
      <View style={styles.container}>

        {media.type === 'image' ? (
          <Image source={{ uri: media.uri }} style={styles.preview} />
        ) : (
          <Video
            source={{ uri: media.uri }}
            style={styles.preview}
            controls
            resizeMode="contain"
          />
        )}

      </View>
      <View style={{ margin: 20 }}>
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  preview: { width: '90%', height: '80%', },
  uploadBtn: {
    marginTop: 30,
    backgroundColor: '#0099ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  uploadText: { color: '#fff', fontSize: 16 },
});

export default StoryPreview;
