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
}) {
  const video = React.useRef(null);
  const shouldMute = useSelector(state => state.VideoMuteSlice.isMute);
  const [play, setPlay] = React.useState(false);

  React.useEffect(() => {
    setPlay(shouldPlay);
  }, [shouldPlay]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={{width: '100%', height: '100%', alignItems: 'center'}}
        onPress={onMuteClick}>
        {url != '' && (
          <Video
            ref={video}
            style={styles.video(screen == 'Reel')}
            source={{
              uri: url,
            }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={play}
            isMuted={shouldMute}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  video: condition => {
    return {
      flex: 1,

      width: WIDTH,
      height: HEIGHT,
      bottom: condition ? '0%' : '5.4%',
    };
  },
  buttons: {
    flexDirection: 'row',

    alignItems: 'center',
  },
});
