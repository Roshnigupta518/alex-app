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
alignC:{
alignItems:'center'
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
    imgsty: { width: wp(16), height: wp(16) },
    minimgsty: { width: wp(12), height: wp(12), marginRight:5 },
  profileCounts: {
    flexDirection: 'row',
    // marginLeft: 15
  },
  iconsty:{
    overflow: 'visible', 
    marginRight:wp(10)
  },
  row:{
    flexDirection:'row'
  },
  wdh50:{
    width:'50%'
  },
  circle:{
    width:wp(30),
    height:wp(30),
    alignItems:'center',
    backgroundColor: 'white',
    borderRadius:100,
    justifyContent:'center',
    marginBottom:15
},
cir_pos:{
  position:'absolute',
  top:40,
  right:15
},
businessInfo:{
  paddingHorizontal:15, 
  flexDirection:'row', 
  marginTop:5
},
btnsty:{borderWidth:1,borderColor:colors.primaryColor,backgroundColor:colors.primaryColor,
   borderRadius:5, padding:10, alignItems:'center'},

   wdh48:{
    width:'48%'
   },
   center:{
    flex:1,
    alignItems:'center', 
    justifyContent:'center'
   },
   mt_10:{
    marginTop:10
   }
})

