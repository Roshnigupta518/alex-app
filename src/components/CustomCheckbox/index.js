import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Linking } from "react-native";
import { fonts, wp } from "../../constants";
import { colors } from "../../constants";

const CustomCheckBox = ({ label, checked, onChange, size = 20, color = "#4A90E2" }) => {

    // Function to open a URL
    const openURLHandle = async (url) => {
       
        try {
            //   const supported = await Linking.canOpenURL(url);
            //   if (supported) {
            await Linking.openURL(url);
            //   } else {
            //     console.log("Don't know how to open this URL: " + url);
            //   }
        } catch (err) {
            console.error("An error occurred", err);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onChange}
            style={styles.container}
        >
            <View
                style={[
                    styles.box,
                    {
                        width: size,
                        height: size,
                        borderColor: checked ? color : "#999",
                        backgroundColor: checked ? color : "#fff",
                    },
                ]}
            >
                {checked && <Text style={styles.check}>✔</Text>}
            </View>
            {label && <Text style={styles.label}>{label}
                <Text onPress={() => openURLHandle('https://thealexapp.com/privacy-policy/')}
                    style={{ color: colors.primaryColor, textDecorationLine: 'underline' }}>Privacy Policy.</Text> </Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    box: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 4, // square edges (like checkbox)
    },
    check: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    label: {
        marginLeft: 10,
        fontFamily: fonts.regular,
        fontSize: wp(12),
        color: colors.black,
        marginTop: 4
    },
});

export default CustomCheckBox;
