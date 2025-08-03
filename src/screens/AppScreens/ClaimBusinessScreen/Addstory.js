import React from "react";
import { View, Text } from "react-native";
import BackHeader from "../../../components/BackHeader";
import st from "../../../global/styles";

const AddStory = ({navigation}) => {
    return(
        <View style={st.container}>
           <BackHeader label={'Add Story'} />
        </View>
    )
}

export default AddStory;