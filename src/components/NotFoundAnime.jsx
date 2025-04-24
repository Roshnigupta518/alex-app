import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {colors, fonts, HEIGHT, wp} from '../constants';
import LottieView from 'lottie-react-native';
import animation from '../constants/AnimationConstants';

const NotFoundAnime = ({isLoading = false}) => {
  return (
    <View
      style={{
        height: HEIGHT / 2.2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors.primaryColor} />
      ) : (
        <LottieView
          source={animation.notFound}
          style={{
            height: HEIGHT / 4,
            width: HEIGHT / 4,
          }}
          autoPlay
          loop
        />
      )}
    </View>
  );
};

export default NotFoundAnime;
