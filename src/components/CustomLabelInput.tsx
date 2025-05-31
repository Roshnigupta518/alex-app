import React, {ReactNode, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {colors, fonts, wp} from '../constants';
import ImageConstants from '../constants/ImageConstants';

interface inputProps {
  label: string;
  placeholder: string;
  value: string;
  onTextChange: (txt: string) => void;
  isPassword: boolean;
  keyboardType:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'phone-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  placeholderColor?: string;
  renderRightView?: () => ReactNode;
  eyeStyle?: ImageStyle;
  theme?: 'light' | 'dark';
  editable?: boolean;
}

const CustomLabelInput = ({
  label = '',
  placeholder = label,
  placeholderColor = 'grey',
  value = '',
  onTextChange = (txt: string) => {},
  isPassword = false,
  keyboardType = 'default',
  containerStyle,
  labelStyle,
  renderRightView,
  eyeStyle,
  theme = 'light',
  editable = true,
}: inputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={[styles.container, containerStyle,{backgroundColor: (!editable)? colors.lightGray:''}]}>
      <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>

      <View style={styles.inputConatiner}>
        <TextInput
          style={[
            styles.inputStyle,
            {color: theme == 'dark' ? colors.white : colors.black},
          ]}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={
            theme == 'dark' ? colors.white : colors.lightBlack
          }
          editable={editable}
          value={value}
          onChangeText={onTextChange}
        />

        {typeof renderRightView == 'function' && renderRightView()}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeContainer}>
            <Image
              source={
                isPasswordVisible
                  ? ImageConstants.openEye
                  : ImageConstants.closeEye
              }
              style={[styles.eyeImageStyle, eyeStyle]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.borderGrayColor,
    borderRadius: 5,
  },

  labelStyle: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    fontFamily: fonts.regular,
    fontSize: wp(12),
  },

  inputConatiner: {
    marginTop: wp(5),
    marginHorizontal: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputStyle: {
    flex: 1,
    paddingVertical: wp(10),
    marginTop: 4,
    fontSize: wp(14),
    paddingHorizontal: wp(10),
  },

  eyeContainer: {
    marginHorizontal: wp(5),
  },

  eyeImageStyle: {
    height: wp(30),
    width: wp(30),
    resizeMode: 'contain',
  },
});

export default CustomLabelInput;
