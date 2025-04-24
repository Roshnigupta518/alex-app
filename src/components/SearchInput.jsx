import React from 'react';
import {View, Text, Image, TextInput, Platform} from 'react-native';
import ImageConstants from '../constants/ImageConstants';
import {colors, wp} from '../constants';

const SearchInput = ({
  placeholder = 'Search',
  value = '',
  onChangeText = () => {},
  containerStyle,
}) => {
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: colors.white,
          elevation: 3,
          borderColor: colors.white,
          shadowColor: colors.black,
          shadowOpacity: 0.2,
          shadowOffset: {width: 1, height: 1},
          shadowRadius: 10,
          flexDirection: 'row',
          paddingVertical: Platform.OS == 'android' ? 0 : wp(11),
          paddingHorizontal: wp(10),
          alignItems: 'center',
        },
        containerStyle,
      ]}>
      <Image source={ImageConstants.searchInput} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={{
          marginLeft: 10,
          flex: 1,
        }}
      />
    </View>
  );
};

export default SearchInput;
