import React,{} from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import st from "../../global/styles";
import ImageConstants from "../../constants/ImageConstants";
import { openSocialLink } from "../../validation/helper";
export const SocialLinks =({data})=>{
    return(
        <View style={[st.profileCounts, {flexDirection: 'row' }]}>
                
        {data?.socialLinks?.tiktok ? (
          <TouchableOpacity style={st.iconsty} onPress={() => openSocialLink(data.socialLinks.tiktok)}>
            <Image source={ImageConstants.tiktok} style={st.imgsty} resizeMode="contain" />
          </TouchableOpacity>
         ) : null} 

        {data?.socialLinks?.twitter ? (
          <TouchableOpacity  style={st.iconsty} onPress={() => openSocialLink(data.socialLinks.twitter)}>
            <Image source={ImageConstants.twitter} style={st.imgsty} resizeMode="contain" />
          </TouchableOpacity>
        ) : null} 

        {data?.socialLinks?.instagram ? (
          <TouchableOpacity style={st.iconsty} onPress={() => openSocialLink(data.socialLinks.instagram)}>
            <Image source={ImageConstants.instagram} style={st.imgsty} resizeMode="contain" />
          </TouchableOpacity>
        ) : null} 

         {data?.socialLinks?.facebook ? ( 
          <TouchableOpacity style={st.iconsty} onPress={() => openSocialLink(data.socialLinks.facebook)}>
            <Image source={ImageConstants.facebook} style={st.imgsty} resizeMode="contain" />
          </TouchableOpacity>
         ) : null} 

        {data?.socialLinks?.youtube ? ( 
          <TouchableOpacity  style={st.iconsty} onPress={() => openSocialLink(data.socialLinks.youtube)}>
            <Image source={ImageConstants.youtube} style={st.imgsty} resizeMode="contain" />
          </TouchableOpacity>
       ) : null} 
      </View>
    )
}