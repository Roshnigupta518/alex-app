import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {colors, wp} from '../constants';
import ImageConstants from '../constants/ImageConstants';
import {useNavigation} from '@react-navigation/native';

const NotificationSearchHeader = ({isBusiness}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp(15),
        marginTop: Platform.OS == 'android' ? wp(20) : 0,
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchScreen',{isBusiness: isBusiness})}
        style={{
          backgroundColor: colors.black,
          padding: wp(10),
          borderRadius: 40,
          borderWidth: 2,
          borderColor: colors.primaryColor,
        }}>
        <Image
          source={ImageConstants.search}
          style={{
            height: 24,
            width: 24,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationScreen')}
        style={{
          backgroundColor: colors.black,
          padding: wp(10),
          borderRadius: 40,
          borderWidth: 2,
          borderColor: colors.primaryColor,
        }}>
        <Image
          source={ImageConstants.bell}
          style={{
            height: 24,
            width: 24,
            resizeMode: 'contain',
            tintColor: colors.white,
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotificationSearchHeader;
