import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import MediaPickerSheet from '../../../components/MediaPickerSheet';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {tagPeopleAction} from '../../../redux/Slices/TagPeopleSlice';
import {tagBusinessAction} from '../../../redux/Slices/TagBusinessSlice';

const PostMediaScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const mediaRef = useRef();
  const [mediaPicker, setMediaPicker] = useState('photo');

  const businessItem = route?.params?.item

  // console.log({businessItem})

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ],
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (Platform.OS == 'android') {
        requestCameraPermission();
      }
      dispatch(tagPeopleAction([]));
      dispatch(tagBusinessAction(null));
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.titleStyle}>Create Post</Text>

        <View style={styles.optionContainer}>
          <View style={styles.subOptionContainer}>
            <TouchableOpacity
              onPress={() => {
                setMediaPicker('photo');
                mediaRef.current?.open();
              }}
              style={styles.buttonView}>
              <View style={styles.cardContainer}>
                <Image source={ImageConstants.apps} style={styles.iconStyle} />
              </View>
              <Text style={styles.iconTxtStyle}>Post Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMediaPicker('video');
                mediaRef.current?.open();
              }}
              style={styles.buttonView}>
              <View style={styles.cardContainer}>
                <Image
                  source={ImageConstants.videoplay}
                  style={styles.iconStyle}
                />
              </View>
              <Text style={styles.iconTxtStyle}>Post Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <MediaPickerSheet
        ref={mediaRef}
        mediaType={mediaPicker}
        onMediaClick={res =>
          navigation.navigate('MediaReviewScreen', {
            media: res,
            media_type: mediaPicker,
            businessItem: businessItem
          })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  subContainer: {
    flex: 1,
    margin: wp(15),
  },

  titleStyle: {
    fontFamily: fonts.semiBold,
    color: colors.primaryColor,
    fontSize: wp(20),
  },

  optionContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  subOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  buttonView: {
    alignItems: 'center',
  },

  cardContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 40,
    height: wp(50),
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconStyle: {
    height: wp(23),
    width: wp(23),
    tintColor: colors.black,
  },

  iconTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.black,
    marginTop: wp(10),
  },
});

export default PostMediaScreen;
