import React, {useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors, fonts, HEIGHT, wp} from '../../../constants';
import MediaPickerSheet from '../../../components/MediaPickerSheet';
import ImageConstants from '../../../constants/ImageConstants';

const BusinessUserInputs = ({
  theme = 'dark',
  value = '',
  onChangeText = txt => {},
  label = '',
  placeholder = '',
  keyboardType = 'default',
  maxlenght = 0,
}) => {
  return (
    <View>
      <Text style={styles.labelStyle}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme == 'dark' ? colors.white : colors.black}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.inputStyle(theme)}
        maxLength={maxlenght > 0 ? maxlenght : 255}
      />
    </View>
  );
};

const BusinessUserDescriptionInput = ({
  theme = 'dark',
  value = '',
  onChangeText = txt => {},
  label = '',
  placeholder = '',
}) => {
  return (
    <View>
      <Text style={styles.labelStyle}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        multiline={true}
        placeholderTextColor={theme == 'dark' ? colors.white : colors.black}
        value={value}
        onChangeText={onChangeText}
        style={styles.inputDescStyle(theme)}
      />
    </View>
  );
};

const BusinessImagePicker = ({
  extraImage = '',
  label = '',
  theme = 'dark',
  image = null,
  getImageFile = () => {},
}) => {
  const mediaRef = useRef();
  return (
    <View>
      <Text style={styles.labelStyle}>{label}</Text>
      <TouchableOpacity
        onPress={() => mediaRef.current?.open()}
        activeOpacity={0.8}
        style={{
          flexWrap: 'wrap',
          backgroundColor:
            theme == 'dark' ? colors.black : colors.lightPrimaryColor,
          padding: wp(10),
          borderRadius: 5,
          marginTop: wp(7),
          marginBottom: wp(13),
        }}>
        {image?.uri == undefined && extraImage != '' ? (
          <Image
            source={{
              uri: extraImage,
            }}
            style={{
              height: wp(60),
              width: wp(60),
              borderRadius: 10,
            }}
          />
        ) : (
          <View>
            {image?.uri != undefined ? (
              <Image
                source={{
                  uri: image?.uri,
                }}
                style={{
                  height: wp(60),
                  width: wp(60),
                  borderRadius: 10,
                }}
              />
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: theme == 'dark' ? colors.white : colors.black,
                  borderStyle: 'dashed',
                  padding: 15,
                }}>
                <View
                  style={{
                    backgroundColor: colors.primaryColor,
                    borderRadius: 30,
                    padding: 6,
                  }}>
                  <Image
                    source={ImageConstants.plus}
                    style={{
                      height: wp(15),
                      width: wp(15),
                      tintColor: colors.black,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <MediaPickerSheet
        ref={mediaRef}
        onCameraClick={res => getImageFile(res)}
        onMediaClick={res => getImageFile(res)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.black,
  },

  inputStyle: theme => {
    return {
      backgroundColor:
        theme == 'dark' ? colors.black : colors.lightPrimaryColor,
      paddingVertical: wp(15),
      paddingHorizontal: wp(10),
      color: theme == 'dark' ? colors.white : colors.black,
      borderRadius: 5,
      marginTop: 7,
      marginBottom: wp(13),
    };
  },

  inputDescStyle: theme => {
    return {
      backgroundColor:
        theme == 'dark' ? colors.black : colors.lightPrimaryColor,
      paddingVertical: wp(15),
      paddingHorizontal: wp(10),
      color: theme == 'dark' ? colors.white : colors.black,
      borderRadius: 5,
      marginTop: 7,
      marginBottom: wp(13),
      height: wp(100),
      textAlignVertical: 'top',
    };
  },
});

export {BusinessUserInputs, BusinessUserDescriptionInput, BusinessImagePicker};
