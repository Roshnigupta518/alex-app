import {StyleSheet, Platform} from 'react-native';
import {colors, WIDTH, HEIGHT, fonts, wp} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: WIDTH - 20,
    alignSelf: 'center',
    zIndex: 1,
    // top:Platform.OS == 'android' ? '12%' : '15%'
  },

  nearMeView: {
    marginVertical: wp(20),
    height:50,
    backgroundColor: colors.borderGrayColor,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    maxWidth: WIDTH / 2.2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    marginRight:wp(5)
  },

  locationIconStyle: {
    height: wp(24),
    width: wp(24),
    resizeMode: 'contain',
    marginRight: 10,
    tintColor: colors.primaryColor,
  },

  nearMeTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.black,
    maxWidth: WIDTH / 3,
  },

  rightIconContainer: {
    height: wp(35),
    width: wp(35),
    backgroundColor: colors.white,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryColor,
    marginVertical: wp(5),
  },

  rightIconStyle: {
    height: wp(20),
    width: wp(20),
    resizeMode: 'contain',
    tintColor: colors.lightBlack,
  },

  notificationParentContainer: {
    backgroundColor: colors.black,
    padding: 2,
    borderRadius: 30,
    position: 'absolute',
    zIndex: 2,
    right: 6,
    top: 3,
  },

  notificationChildView: {
    height: 5,
    width: 5,
    borderRadius: 30,
    backgroundColor: colors.primaryColor,
  },
});

export default styles;
