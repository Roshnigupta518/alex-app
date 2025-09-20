import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../constants'
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomContainer = ({children}) => {
    const insets = useSafeAreaInsets();
  return (
    <View style={{flex:1, backgroundColor:colors.white, paddingBottom: insets.bottom, }}>
      {children}
    </View>
  )
}

export default CustomContainer

const styles = StyleSheet.create({})