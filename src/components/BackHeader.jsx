import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {colors, fonts, wp} from '../constants';
import ImageConstants from '../constants/ImageConstants';
import {useNavigation} from '@react-navigation/native';

const BackHeader = ({label = '',rightView = () => {}, labelStyle, onPress,profileEdit,onEdit, }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if(onPress){
            onPress()
          }else{
          navigation.goBack()
        }
        }}
        activeOpacity={0.8}
        style={styles.buttonViewStyle}>
        <Image source={ImageConstants.leftArrow} />
      </TouchableOpacity>
    <View style={{flexDirection:'row'}}>
      <Text
        style={[
          {
            fontFamily: fonts.semiBold,
            fontSize: wp(18),
            color: colors.black,
          },
          labelStyle,
        ]}>
        {label}
      </Text>
      {profileEdit&&
      <TouchableOpacity onPress={onEdit}>
      <Image source={ImageConstants.edit} style={{width:wp(20), height:wp(20), marginLeft:5}} />
      </TouchableOpacity>
      }
      </View>

      <View style={styles.rightViewStyle}>{rightView && rightView()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS == 'android' ? wp(15) : 0,
  },

  buttonViewStyle: {
    backgroundColor: colors.lightBlack,
    paddingVertical: wp(10),
    paddingHorizontal: wp(20),
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  rightViewStyle: {marginHorizontal: wp(10), minWidth: wp(25)},
});

export default BackHeader;
