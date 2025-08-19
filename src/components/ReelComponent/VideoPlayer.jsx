import * as React from 'react';
import {View, StyleSheet, Button, TouchableOpacity, Image} from 'react-native';
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
  isPaused
}) {
  const video = React.useRef(null);
  const shouldMute = useSelector(state => state.VideoMuteSlice.isMute);
  const [play, setPlay] = React.useState(false);

  React.useEffect(() => {
    if (!video.current) return;

    if (isPaused) {
      video.current.pauseAsync();
    } else if (shouldPlay) {
      video.current.playAsync();
    }
  }, [isPaused, shouldPlay]);
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ width:WIDTH, height: screenHeight, alignItems: 'center'}}
        onPress={onMuteClick}>
        {url != '' && (
          <Video
            ref={video}
            // style={styles.video(screen == 'Reel')}
            style={{width:WIDTH, height: screenHeight}}
            source={{
              uri: url,
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={shouldPlay && !isPaused} // ✅ built-in control
            isMuted={shouldMute}
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
});
