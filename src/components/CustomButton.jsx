import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fonts, wp} from '../constants';
import ImageConstants from '../constants/ImageConstants';
import animation from '../constants/AnimationConstants';
import LottieView from 'lottie-react-native';

const CustomButton = ({
  label = '',
  onPress = () => {},
  backgroundColor = '',
  disabled = false,
  isLoading = false,
  arrowCardColor = '',
  txtColor = '',
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container(backgroundColor)}>
      <View style={styles.subViewStyle}>
        {isLoading ? (
          <LottieView
            source={animation.waveLoader}
            style={styles.animationLoader}
            autoPlay
            loop
          />
        ) : (
          <Text numberOfLines={1} style={styles.txtStyle(txtColor)}>
            {label}
          </Text>
        )}
      </View>

      <View style={styles.arrowViewStyle(arrowCardColor)}>
        <Image
          source={ImageConstants.leftArrow}
          style={styles.imageViewStyle(backgroundColor)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: color => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: wp(30),
      backgroundColor: color || colors.primaryColor,
      marginHorizontal: 20,
    };
  },

  subViewStyle: {
    flex: 0.8,
  },

  txtStyle: (txtColor = '') => {
    return {
      fontFamily: fonts.medium,
      letterSpacing: 1,
      fontSize: wp(16),
      color: txtColor || colors.black,
      marginHorizontal: wp(20),
    };
  },

  arrowViewStyle: (backgroundColor = '') => {
    return {
      flex: 0.2,
      paddingVertical: wp(18),
      backgroundColor: backgroundColor || colors.black,
      alignItems: 'center',
    };
  },

  imageViewStyle: color => {
    return {
      transform: [{rotate: '180deg'}],
      tintColor: color || colors.primaryColor,
      height: 20,
      width: 20,
      resizeMode: 'contain',
    };
  },

  animationLoader: {
    height: wp(20),
    with: wp(20),
  },
});

export default CustomButton;
