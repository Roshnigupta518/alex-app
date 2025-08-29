import * as React from 'react';
import {View, StyleSheet, Button, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {Video, ResizeMode} from 'expo-av';
import {colors, HEIGHT, WIDTH, wp} from '../../constants';
import {useSelector} from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
export default function VideoPlayer({
  url = '',
  shouldPlay,
  screen = '',
  onMuteClick = () => {},
  screenHeight,
  thumbnail
}) {
  const video = React.useRef(null);
  const shouldMute = useSelector(state => state.VideoMuteSlice.isMute);
  const [play, setPlay] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(false)
  const [error, setError] = React.useState(false)

  // React.useEffect(() => {
  //   setPlay(shouldPlay);
  // }, [shouldPlay]);

   // 👇 Control play/pause imperatively
   React.useEffect(() => {
    if (!video.current) return;
    (async () => {
      try {
        if (shouldPlay) {
          await video.current.playAsync();
        } else {
          await video.current.pauseAsync();
        }
      } catch (e) {
        console.log('playback control error:', e);
      }
    })();
  }, [shouldPlay]);

  const getOptimizedMediaUrl = (url, { isVideo = false, width, height } = {}) => {
    if (!url) return '';
  
    const transforms = [];
    if (isVideo) {
      transforms.push('vc-auto', 'f-mp4');
    } else {
      transforms.push('f-auto', 'q-80');
    }
  
    if (width) transforms.push(`w-${width}`);
    if (height) transforms.push(`h-${height}`);
  
    const tr = transforms.join(',');
    return `${url}?tr=${encodeURIComponent(tr)}`;
  };

  const optimizedUrl = getOptimizedMediaUrl(url);

  // console.log({optimizedUrl})

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ width:WIDTH, height: screenHeight, alignItems: 'center'}}
        onPress={onMuteClick}>
        {!error && url != '' && (
          <Video
            ref={video}
            // style={styles.video(screen == 'Reel')}
            style={{width:WIDTH, height: screenHeight}}
            source={{
              uri: optimizedUrl,
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            // shouldPlay={play} 
            isMuted={shouldMute}
            onLoadStart={() => setIsBuffering(true)} // start buffering
            onReadyForDisplay={() => setIsBuffering(false)} // video ready
            onError={(e) => {
              console.log("Video error:", e, optimizedUrl);
              setError(true);
              setIsBuffering(false);
            }}
          />
        )}

         {/* fallback if decoding fails */}
         {error && (
          <Image
            source={{ uri: thumbnail}}
            style={{ width: WIDTH, height: screenHeight }}
          />
        )}

          {isBuffering && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={styles.loader}
          />
        )}
      </TouchableOpacity>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: colors.black,
    // alignItems: 'center',
  },
  video: condition => {
    return {
      // flex: 1,

      width: WIDTH,
      height: HEIGHT,
      // bottom: condition ? '0%' : '5.4%',
    };
  },
  buttons: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -20,
  },
});
