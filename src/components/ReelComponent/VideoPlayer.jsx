// import * as React from 'react';
// import {View, StyleSheet, Button, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
// import {Video, ResizeMode} from 'expo-av';
// import {colors, HEIGHT, WIDTH, wp} from '../../constants';
// import {useSelector} from 'react-redux';
// import crashlytics from '@react-native-firebase/crashlytics';
// export default function VideoPlayer({
//   url = '',
//   shouldPlay,
//   screen = '',
//   onMuteClick = () => {},
//   screenHeight,
//   thumbnail
// }) {
//   const video = React.useRef(null);
//   const shouldMute = useSelector(state => state.VideoMuteSlice.isMute);
//   const [play, setPlay] = React.useState(false);
//   const [isBuffering, setIsBuffering] = React.useState(false)
//   const [error, setError] = React.useState(false)


//     // Clean up when component unmounts (release memory)
//     React.useEffect(() => {
//       return () => {
//         if (video.current) {
//           video.current.stopAsync().catch(() => {});
//           video.current.unloadAsync().catch(() => {});
//           video.current = null; 
//         }
//       };
//     }, []);

//     // React.useEffect(() => {
//     //   let isMounted = true;

//     //   const controlPlayback = async () => {
//     //     if (!video.current) return;

//     //     try {
//     //       const status = await video.current.getStatusAsync();

//     //       // agar video abhi tak mount nahi hua
//     //       if (!isMounted || !status.isLoaded) return;

//     //       if (shouldPlay && !status.isPlaying) {
//     //         await video.current.playAsync();
//     //       } else if (!shouldPlay && status.isPlaying) {
//     //         await video.current.pauseAsync();
//     //       }
//     //     } catch (e) {
//     //       console.log("playback control error:", e?.message);
//     //     }
//     //   };

//     //   controlPlayback();

//     //   return () => {
//     //     isMounted = false;
//     //   };
//     // }, [shouldPlay]);


//     React.useEffect(() => {
//       let isMounted = true;

//       const controlPlayback = async () => {
//         if (!video.current) return;

//         try {
//           const status = await video.current.getStatusAsync();
//           if (!isMounted) return;

//           if (shouldPlay) {
//             if (!status.isLoaded) {
//               await video.current.loadAsync(
//                 { uri: url },
//                 { shouldPlay: true, isMuted: shouldMute }
//               );
//             } else if (!status.isPlaying) {
//               await video.current.playAsync();
//             }
//           } else {
//             if (status.isLoaded && status.isPlaying) {
//               await video.current.pauseAsync();
//             }
//           }
//         } catch (e) {
//           console.log('playback control error:', e?.message);
//         }
//       };

//       controlPlayback();

//       return () => {
//         isMounted = false;
//       };
//     }, [shouldPlay, url, shouldMute]);



//   if (!shouldPlay) {
//     return (
//       <Image
//         source={{ uri: thumbnail }}
//         style={{ width: WIDTH, height: screenHeight }}
//       />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         activeOpacity={1}
//         style={{ width:WIDTH, height: screenHeight, alignItems: 'center'}}
//         onPress={onMuteClick}>
//         {!error && url != '' && (
//           <Video
//             ref={video}
//             key={url}  
//             // style={styles.video(screen == 'Reel')}
//             style={{width:WIDTH, height: screenHeight}}
//             source={{
//               uri: url,
//             }}
//             useNativeControls={false}
//             resizeMode={ResizeMode.CONTAIN}
//             isLooping
//             shouldPlay={shouldPlay} 
//             isMuted={shouldMute}
//             onLoadStart={() => setIsBuffering(true)} // start buffering
//             onReadyForDisplay={() => setIsBuffering(false)} // video ready
//             onError={(e) => {
//               console.log("Video error:", e, url);
//               setError(true);
//               setIsBuffering(false);
//             }}
//             onPlaybackStatusUpdate={(status) => {
//               if (status.isLoaded) {
//                 setIsBuffering(status.isBuffering);
//                 if (shouldPlay && !status.isPlaying) {
//                   video.current?.playAsync();
//                 }
//               }
//             }}
//           />
//         )}

//          {/* fallback if decoding fails */}
//          {error && (
//           <Image
//             source={{ uri: thumbnail}}
//             style={{ width: WIDTH, height: screenHeight }}
//           />
//         )}

//           {isBuffering && (
//           <ActivityIndicator
//             size="large"
//             color="#fff"
//             style={styles.loader}
//           />
//         )}
//       </TouchableOpacity>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // backgroundColor: colors.black,
//     // alignItems: 'center',
//   },
//   video: condition => {
//     return {
//       // flex: 1,

//       width: WIDTH,
//       height: HEIGHT,
//       // bottom: condition ? '0%' : '5.4%',
//     };
//   },
//   buttons: {
//     flexDirection: 'row',

//     alignItems: 'center',
//   },
//   loader: {
//     position: "absolute",
//     alignSelf: "center",
//     top: "50%",
//     marginTop: -20,
//   },
// });



import * as React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator, Animated
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useSelector } from "react-redux";
import { WIDTH } from "../../constants";

export default function VideoPlayer({
  url = "",
  shouldPlay,
  screen = "",
  onMuteClick = () => { },
  screenHeight,
  thumbnail,
}) {
  const videoRef = React.useRef(null);
  const shouldMute = useSelector((state) => state.VideoMuteSlice.isMute);

  const [isBuffering, setIsBuffering] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [isVideoReady, setIsVideoReady] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current; // thumbnail opacity

  const handleVideoReady = () => {
    setIsVideoReady(true);

    // Animate thumbnail fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.stopAsync().catch(() => {});
        videoRef.current.unloadAsync().catch(() => { });
        videoRef.current = null;
      }
    };
  }, []);

  // Control playback when props change
  React.useEffect(() => {
    let isMounted = true;

    const controlPlayback = async () => {
      if (!videoRef.current) return;

      try {
        const status = await videoRef.current.getStatusAsync();
        if (!isMounted || !status.isLoaded) return;

        if (shouldPlay) {
          if (!status.isPlaying) {
            await videoRef.current.playAsync();
          }
        } else {
          if (status.isPlaying) {
            await videoRef.current.pauseAsync();
          }
        }
      } catch (e) {
        console.log("playback control error:", e?.message);
      }
    };

    controlPlayback();

    return () => {
      isMounted = false;
    };
  }, [shouldPlay, shouldMute, url]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ width: WIDTH, height: screenHeight, alignItems: "center" }}
        onPress={onMuteClick}
      >
        {!error && url !== "" && (
          <Video
            ref={videoRef}
            // key={url} // force reload on URL change
            style={{ width: WIDTH, height: screenHeight }}
            source={{ uri: url }}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={shouldPlay}
            isMuted={shouldMute}
            useNativeControls={false}
            onLoadStart={() => setIsBuffering(true)}
            onReadyForDisplay={() => {
              setTimeout(() => {
              handleVideoReady()
              setIsBuffering(false);
              setError(false);
              console.log('ready to display, hide loader');
              console.log('ready to display', isBuffering)
            }, 120);
            }}
            onError={(e) => {
              console.log("Video error:", e, url);
              setError(true);
              setIsBuffering(false);
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status?.isLoaded) {
                // setIsBuffering(status.isBuffering);
                // Agar video already ready h to loader ignore karo
                if (!isVideoReady) {
                  setIsBuffering(status.isBuffering);
                }
                // Ensure autoplay works
                if (shouldPlay && !status.isPlaying) {
                  videoRef.current?.playAsync().catch(() => { });
                }
              }
            }}
            progressiveRenderingEnabled={false}
            posterSource={thumbnail ? { uri: thumbnail } : null}
            usePoster={true}
          />
        )}


        {/* Show thumbnail until video is ready */}
        {/* {!isVideoReady && thumbnail && (
          <Animated.Image
            source={{ uri: thumbnail }}
            style={{
              width: WIDTH,
              height: screenHeight,
              position: "absolute",
              resizeMode: 'contain',
              top: 0,
              left: 0,
              opacity: isVideoReady ? fadeAnim : 1, // fade out instead of blink
            }}
          />
        )} */}

       {/* Loader overlay */}
        {/* {isBuffering && (
          <View style={[styles.loaderOverlay, { width: WIDTH, height: screenHeight }]}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )} */}

      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  loader: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -20,
  },

  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // smooth overlay
  },
  
});

