import {StyleSheet} from 'react-native';
import {colors, WIDTH, HEIGHT, fonts, wp} from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: WIDTH - 20,
    alignSelf: 'center',
    zIndex: 2,
  },

  nearMeView: {
    marginVertical: wp(20),
    backgroundColor: colors.borderGrayColor,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    maxWidth: WIDTH / 2.2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primaryColor,
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
    height: wp(45),
    width: wp(45),
    backgroundColor: colors.white,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryColor,
    marginVertical: wp(5),
  },

  rightIconStyle: {
    height: wp(23),
    width: wp(23),
    resizeMode: 'contain',
    tintColor: colors.lightBlack,
  },

  notificationParentContainer: {
    backgroundColor: colors.black,
    padding: 3,
    borderRadius: 30,
    position: 'absolute',
    zIndex: 2,
    right: 10,
    top: 10,
  },

  notificationChildView: {
    height: 7,
    width: 7,
    borderRadius: 30,
    backgroundColor: colors.primaryColor,
  },
});

export default styles;
