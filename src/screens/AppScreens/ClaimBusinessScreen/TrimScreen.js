import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { ProcessingManager } from 'react-native-video-processing';
import { useNavigation, useRoute } from '@react-navigation/native';

const TrimScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const  videoUri  = route?.params?.uri;

  console.log({videoUri})

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [isTrimming, setIsTrimming] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const onLoad = (data) => {
    setDuration(Math.floor(data.duration));
    if (data.duration < 30) setEndTime(Math.floor(data.duration));
  };

  const handleTrim = async () => {
    console.log({endTime, startTime})
    if (endTime - startTime > 30) {
      Alert.alert('Trim Limit', 'Max 30 seconds allowed');
      return;
    }

    setIsTrimming(true);
    try {
      const result = await ProcessingManager.trim(videoUri, {
        startTime,
        endTime,
        quality: 'High',
        saveToCameraRoll: false,
      });
      console.log({result})
      navigation.navigate('StoryPreview', {
        media: { type: 'video', uri: result },
      });
    } catch (error) {
      Alert.alert('Trim Failed', 'An error occurred while trimming the video.');
      console.error('Trim error:', error);
    } finally {
      setIsTrimming(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trim Video</Text>

      <Video
        source={{ uri: videoUri }}
        ref={videoRef}
        onLoad={onLoad}
        style={styles.video}
        resizeMode="contain"
        controls
      />

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Start: {startTime}s</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration - 1}
          step={1}
          value={startTime}
          onValueChange={(value) => {
            setStartTime(value);
            if (value > endTime - 1) setEndTime(value + 1);
          }}
        />
        <Text style={styles.label}>End: {endTime}s</Text>
        <Slider
          style={styles.slider}
          minimumValue={startTime + 1}
          maximumValue={duration}
          step={1}
          value={endTime}
          onValueChange={(value) => setEndTime(value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleTrim} disabled={isTrimming}>
        {isTrimming ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Trim and Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TrimScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: 'white', fontSize: 20, textAlign: 'center', marginBottom: 10 },
  video: { width: '100%', height: 250, backgroundColor: 'black' },
  sliderContainer: { marginTop: 20 },
  slider: { width: '100%', height: 40 },
  label: { color: '#ccc', marginVertical: 4 },
  button: {
    marginTop: 30,
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
