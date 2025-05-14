import {Dimensions, StyleSheet} from 'react-native';
import {colors, WIDTH, HEIGHT, fonts, wp} from '../../../constants';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    flex: 1,
    backgroundColor: colors.black,
  },

  firstRowContainer: condition => {
    return {
      paddingBottom: wp(70),
      paddingHorizontal: 15,
      position: 'absolute',
      bottom: condition ? '0%' : '4.6%',
      width: WIDTH,
      // height: HEIGHT / 3.2,
    };
  },

  subFirstRowContiner: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageView: {
    justifyContent: 'center',
  },

  uploadedImageStyle: condition => {
    return {
      // height: HEIGHT,
      width: WIDTH,
      resizeMode: 'contain',
      // bottom: condition ? '0%' : '5.4%',
    };
  },

  imageStyle: {
    height: wp(50),
    width: wp(50),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },

  plusContainer: {
    backgroundColor: colors.black,
    padding: 4,
    borderRadius: 40,
    position: 'absolute',
    right: -10,
    borderWidth: 1,
    borderColor: colors.primaryColor,
  },

  plusImageStyle: {
    height: wp(10),
    width: wp(10),
    tintColor: colors.primaryColor,
  },

  usernameStyle: {
    marginLeft: wp(25),
  },

  nameTxtStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(17),
    color: colors.white,
    width: WIDTH / 2,
  },

  locationTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.primaryColor,
    width: WIDTH / 2,
  },

  hmenuStyle: {
    height: wp(27),
    width: wp(27),
    resizeMode: 'contain',
  },

  secondRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: wp(20),
    marginHorizontal: wp(5),
  },

  subSecondRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  likeContainer: {
    marginRight: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },

  likeImageStyle: isLiked => {
    return {
      height: wp(28),
      width: wp(28),
      resizeMode: 'contain',
      tintColor: isLiked ? colors.red : colors.white,
    };
  },

  likeCountStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(14),
    color: colors.white,
    marginHorizontal: 8,
  },

  commentContainer: {
    marginRight: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentIconStyle: {
    height: wp(28),
    width: wp(28),
    resizeMode: 'contain',
    tintColor: colors.white,
  },

  commentCountStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(14),
    color: colors.white,
    marginHorizontal: 8,
  },

  sendContainer: {
    marginRight: wp(4),
  },

  sendImageStyle: {
    height: wp(28),
    width: wp(28),
    resizeMode: 'contain',
    tintColor: colors.white,
  },

  saveIconStyle: {
    height: wp(28),
    width: wp(28),
    resizeMode: 'contain',
    tintColor: colors.white,
  },

  descriptionTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(13),
    color: colors.white,
    marginTop: 10,
  },

  muteContainer: {
    position: 'absolute',
    zIndex: 3,
    alignSelf: 'center',
    top: HEIGHT / 2.5,
  },

  muteIconStyle: {
    height: WIDTH / 6,
    width: WIDTH / 6,
  },
});

export default styles;
