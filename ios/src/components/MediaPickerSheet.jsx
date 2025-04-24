import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, wp} from '../constants';
import ImageConstants from '../constants/ImageConstants';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from '../constants/Toast';

const MediaPickerSheet = forwardRef(
  (
    {mediaType = 'photo', onCameraClick = () => {}, onMediaClick = () => {}},
    ref,
  ) => {
    const actionsheetRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        actionsheetRef.current?.show();
      },
    }));

    const CropImage = (path, assets) => {
      console.log('assets', JSON.stringify(assets));

      let data = {
        uri: assets[0]?.uri,
        type: assets[0]?.type,
        name: assets[0]?.fileName,
      };
      console.log('data=-=-', JSON.stringify(data));
      onMediaClick(data);
      // ImagePicker.openCropper({
      //   path,
      //   cropping: false,
      // })
      //   .then(image => {
      //     console.log('image=-=-', image);

      //     if (image?.path?.length > 0) {

      //       let data = {
      //         uri: image?.path,
      //         type: image?.mime,
      //         name: filename[filename?.length - 1],
      //       };
      //       onMediaClick(data);

      //       // if (image?.size < 24000000) {
      //       //   onMediaClick(data);
      //       // } else {
      //       //   Toast.error('File Size', 'File size should be less than 24MB.');
      //       // }
      //     }
      //   })
      //   .catch(err => console.log('Picker err: ', err));
    };

    const getFromCamera = async () => {
      launchCamera({mediaType})
        .then(res => {
          if (res?.assets?.length > 0) {
            let data = {
              uri: res.assets[0].uri,
              type: res.assets[0]?.type,
              name: res.assets[0].fileName,
            };
            // onCameraClick(data);
            if (mediaType == 'photo') {
              setTimeout(() => {
                CropImage(res.assets[0].uri, res.assets);
              }, 1000);
            } else {
              if (res?.assets[0].fileSize < 313699773) {
                onMediaClick(data);
              } else {
                Toast.error('Post', 'File size exceeded more than 300 MB.');
              }
            }

            // if (res.assets[0]?.fileSize < 24000000) {
            //   onCameraClick(data);
            // } else {
            //   Toast.error('File Size', 'File size should be less than 24MB.');
            // }
          }
        })
        .catch(err => console.log('Picker err: ', err));
    };

    const getFromGellary = async () => {
      launchImageLibrary({mediaType: mediaType})
        .then(res => {
          if (res?.assets?.length > 0) {
            console.log('video=-=-', res.assets);
            let data = {
              uri: res.assets[0].uri,
              type: res.assets[0]?.type,
              name: res.assets[0].fileName,
            };

            if (mediaType == 'photo') {
              setTimeout(() => {
                CropImage(res.assets[0].uri, res.assets);
              }, 1000);
            } else {
              if (res?.assets[0].fileSize < 310699773) {
                onMediaClick(data);
              } else {
                Toast.error('Post', 'File size exceeded more than 300 MB.');
              }
            }

            // if (res.assets[0]?.fileSize < 24000000) {
            //   onMediaClick(data);
            // } else {
            //   Toast.error('File Size', 'File size should be less than 24MB.');
            // }
          }
        })
        .catch(err => console.log('Picker err: ', err));
    };

    return (
      <ActionSheet
        ref={actionsheetRef}
        containerStyle={{backgroundColor: colors.white}}>
        <View style={styles.container}>
          <Text style={styles.titleStyle}>Choose Media Type</Text>

          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => {
                actionsheetRef.current.hide();
                setTimeout(() => {
                  getFromCamera();
                }, 800);
              }}
              style={styles.boxViewStyle}>
              <Image source={ImageConstants.camera} style={styles.iconStyle} />

              <Text style={styles.iconTxtStyle}>Take From{'\n'}Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                actionsheetRef.current.hide();
                setTimeout(() => {
                  getFromGellary();
                }, 800);
              }}
              style={styles.boxViewStyle}>
              <Image source={ImageConstants.media} style={styles.iconStyle} />

              <Text style={styles.iconTxtStyle}>Select From{'\n'}Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: wp(20),
    marginBottom: wp(30),
    marginHorizontal: wp(25),
  },

  titleStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(16),
    color: colors.black,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-around',
    marginTop: wp(30),
  },

  boxViewStyle: {
    alignItems: 'center',
  },

  iconStyle: {
    height: wp(40),
    width: wp(40),
    resizeMode: 'contain',
    tintColor: colors.primaryColor,
  },

  iconTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(12),
    color: colors.black,
    textAlign: 'center',
  },
});

export default MediaPickerSheet;
