import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import st from "../../global/styles";
import ImageConstants from "../../constants/ImageConstants";
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 120;

const InstaThumbnailSlider = ({ stories, selectedIndex, setSelectedIndex }) => {

    const carouselRef = useRef(null);

    useEffect(() => {
        if (carouselRef.current && selectedIndex < stories.length) {
            carouselRef.current.snapToItem(selectedIndex, true);
        }
    }, [selectedIndex, stories]);

    return (
        <Carousel
            ref={carouselRef}
            data={stories}
            sliderWidth={width}
            itemWidth={ITEM_WIDTH}
            firstItem={selectedIndex}
            inactiveSlideScale={0.85}
            inactiveSlideOpacity={0.7}
            // onSnapToItem={(index) => setSelectedIndex(index)}
            onSnapToItem={(index) => {
                if (index !== selectedIndex) {
                    console.log({ index })
                    setSelectedIndex(index);
                }
            }}
            renderItem={({ item, index }) => (
                <View style={{ alignItems: 'center' }}>
                    {index === selectedIndex ? (
                        <LinearGradient
                            colors={["#DE0046", "#F7A34B", "#F9D423", "#55A861", "#2291CF"]}
                            style={styles.gradientBorder}
                        >
                            <Image
                                // source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail : item.media }}
                                source={
                                    item.media_type === "video/mp4"
                                        ? item.strory_thumbnail
                                            ? { uri: item.strory_thumbnail }
                                            : ImageConstants.business_logo
                                        : item.media
                                            ? { uri: item.media }
                                            : ImageConstants.business_logo
                                }
                                style={styles.storyThumbInside}
                            />
                        </LinearGradient>
                    ) : (
                        <Image
                            // source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail : item.media }}
                            source={
                                item.media_type === "video/mp4"
                                    ? item.strory_thumbnail
                                        ? { uri: item.strory_thumbnail }
                                        : ImageConstants.business_logo
                                    : item.media
                                        ? { uri: item.media }
                                        : ImageConstants.business_logo
                            }
                            style={styles.storyThumb}
                        />
                    )}
                    <View style={st.cardContent}>
                        <Image source={ImageConstants.openEye} />
                        <Text style={st.labelStyle}> {item?.viewers?.length}</Text>
                    </View>
                </View>
            )}
        // key={selectedIndex}
        />
    );
};

export default InstaThumbnailSlider;

const styles = StyleSheet.create({
    gradientBorder: {
        padding: 3,              // Border thickness
        borderRadius: 14,        // Border radius
    },
    storyThumbInside: {
        width: ITEM_WIDTH - 20,  // Smaller image to show border
        height: 150,
        borderRadius: 10,
    },
    storyThumb: {
        width: ITEM_WIDTH - 10,
        height: 150,
        borderRadius: 10,
    },
});
