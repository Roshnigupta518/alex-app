import { StyleSheet } from "react-native";
import { wp,hp, colors, fonts, WIDTH } from "../constants";

export default StyleSheet.create({
container:{
    flex:1
},
content:{
    padding: wp(15),
    // flex: 1,
},
card:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginVertical: 5,
    borderRadius: 8,
  },
  cardContent:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBar:{
    height: wp(60),
    width: wp(4),
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  internalCard:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  profileSty:{
    height: wp(50),
    width: wp(50),
    borderRadius: 90,
    marginHorizontal: 10,
  },
  cardTitle:{
    fontFamily: fonts.semiBold,
    fontSize: wp(16),
    color: colors.black,
    width: WIDTH / 2.2,
  },
    rightTxt:{
      fontFamily: fonts.regular,
      fontSize: wp(12),
      color: colors.black,
      textAlign:'right',
      marginRight:15
    },
})

