import { View, Text, Image, TouchableOpacity } from "react-native";
import ImageConstants from "../../constants/ImageConstants";
import st from "../../global/styles";

const index = ({ item, index, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View key={index} style={st.card}>
        <View
          style={st.cardContent}>
          <View style={st.cardBar} />
          <View
            style={st.internalCard}>

            <Text
              numberOfLines={2}
              style={st.cardTitle}>
              {item?._id}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default index