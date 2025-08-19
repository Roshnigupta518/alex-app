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
const SPACING = 15;

const InstaThumbnailSlider = ({ stories, selectedIndex, setSelectedIndex }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const lastOffset = useRef(0);

    useEffect(() => {
        if (flatListRef.current && stories.length > 0) {
            // Ensure selectedIndex is within bounds
            const validIndex = Math.min(selectedIndex, stories.length - 1);
            flatListRef.current.scrollToIndex({
                index: validIndex,
                animated: true,
                viewPosition: 0.5,
            });
        }
    }, [selectedIndex, stories]);

    const selectedStory = stories[selectedIndex] || {};

    return (
        // <Animated.FlatList
        //     ref={flatListRef}
        //     data={stories}
        //     keyExtractor={(item, index) => item.id + index}
        //     horizontal
        //     showsHorizontalScrollIndicator={false}
        //     snapToInterval={ITEM_WIDTH + SPACING}
        //     decelerationRate="fast"
        //     bounces={false}
        //     contentContainerStyle={{ paddingHorizontal: (width - ITEM_WIDTH) / 2 }}
        //     onScroll={Animated.event(
        //         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        //         { useNativeDriver: true }
        //     )}
        //     onMomentumScrollEnd={(event) => {
        //         const offsetX = event.nativeEvent.contentOffset.x;
        //         const newIndex = Math.round(offsetX / (ITEM_WIDTH + SPACING));
        //         setSelectedIndex(newIndex);
        //         lastOffset.current = offsetX;
        //     }}
        //     getItemLayout={(data, index) => ({
        //         length: ITEM_WIDTH + SPACING,
        //         offset: (ITEM_WIDTH + SPACING) * index,
        //         index,
        //     })}
        //     renderItem={({ item, index }) => {
        //         const inputRange = [
        //             (index - 1) * (ITEM_WIDTH + SPACING),
        //             index * (ITEM_WIDTH + SPACING),
        //             (index + 1) * (ITEM_WIDTH + SPACING),
        //         ];

        //         const scale = scrollX.interpolate({
        //             inputRange,
        //             outputRange: [0.85, 1, 0.85],
        //             extrapolate: "clamp",
        //         });

        //         const isActive = index === selectedIndex;

        //         return (
        //             <View style={[st.container, st.alignC]}>
        //                 <TouchableOpacity
        //                     onPress={() => {
        //                         setSelectedIndex(index);

        //                         if (flatListRef.current) {
        //                             const offset = index * (ITEM_WIDTH + SPACING);

        //                             if (offset !== lastOffset.current) {
        //                                 flatListRef.current.scrollToOffset({
        //                                     offset,
        //                                     animated: true,
        //                                 });
        //                                 lastOffset.current = offset;
        //                             }
        //                         }

        //                     }}
        //                     activeOpacity={0.8}
        //                     style={{ width: ITEM_WIDTH }}
        //                 >
        //                     <Animated.View
        //                         style={{
        //                             transform: [{ scale }],
        //                             marginHorizontal: SPACING / 2,
        //                         }}
        //                     >
        //                         {isActive ? (
        //                             <LinearGradient
        //                                 colors={["#DE0046", "#F7A34B", "#F9D423", "#55A861", "#2291CF"]}
        //                                 style={styles.gradientBorder}
        //                             >
        //                                 <Image 
        //                                 source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail  : item.media }}
        //                                 style={styles.storyThumbInside} />
        //                             </LinearGradient>
        //                         ) : (
        //                             <Image 
        //                             source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail  : item.media }}
        //                              style={styles.storyThumb} />
        //                         )}
        //                     </Animated.View>
        //                 </TouchableOpacity>
        //                 <View style={st.cardContent}>
        //                     <Image source={ImageConstants.openEye} />
        //                     <Text style={st.labelStyle}> {item?.viewers?.length}</Text>
        //                 </View>
        //             </View>
        //         );
        //     }}
        // />

        <Carousel
            data={stories}
            sliderWidth={width}
            itemWidth={ITEM_WIDTH}
            firstItem={selectedIndex}
            inactiveSlideScale={0.85}
            inactiveSlideOpacity={0.7}
            onSnapToItem={(index) => setSelectedIndex(index)}
            renderItem={({ item, index }) => (
                <View style={{ alignItems: 'center' }}>
                    {index === selectedIndex ? (
                        <LinearGradient
                            colors={["#DE0046", "#F7A34B", "#F9D423", "#55A861", "#2291CF"]}
                            style={styles.gradientBorder}
                        >
                            <Image
                                source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail : item.media }}
                                style={styles.storyThumbInside}
                            />
                        </LinearGradient>
                    ) : (
                        <Image
                            source={{ uri: item.media_type === 'video/mp4' ? item.strory_thumbnail : item.media }}
                            style={styles.storyThumb}
                        />
                    )}
                    <View style={st.cardContent}>
                        <Image source={ImageConstants.openEye} />
                        <Text style={st.labelStyle}> {item?.viewers?.length}</Text>
                    </View>
                </View>
            )}
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
