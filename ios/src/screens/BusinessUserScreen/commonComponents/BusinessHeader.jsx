import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';

const BusinessHeader = ({label = '', onAction = () => {}}) => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS == 'android' ? wp(20) : 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: wp(20),
          color: colors.black,
          marginHorizontal: wp(20),
        }}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={onAction}
        style={{
          borderTopLeftRadius: wp(20),
          borderBottomLeftRadius: wp(20),
          backgroundColor: colors.primaryColor,
          paddingHorizontal: wp(20),
          paddingVertical: wp(15),
        }}>
        <Image
          source={ImageConstants.plus}
          style={{
            height: wp(15),
            width: wp(15),
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BusinessHeader;
