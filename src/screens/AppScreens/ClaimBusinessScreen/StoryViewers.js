import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { GetAllStoryRequest } from "../../../services/Utills";
import { colors, wp } from "../../../constants";
import BackHeader from "../../../components/BackHeader";
import st from "../../../global/styles";
import ImageConstants from "../../../constants/ImageConstants";

const StoryViewerScreen = ({ route }) => {
    const { storyId } = route.params || {};
    console.log({ storyId })
    const [stories, setStories] = useState([]);
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const transformStories = (apiResponse) => {
        let storiesList = [];
        apiResponse.forEach(user => {
            user.stories.forEach(story => {
                storiesList.push({
                    ...story,
                    userId: user.user_id,
                    username: user.user_name,
                    profile: user.user_image,
                });
            });
        });
        return storiesList;
    };

    const fetchStories = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await GetAllStoryRequest({ skip, limit });

            if (res?.status) {
                const newStories = transformStories(res.result);
                const updatedStories = [...stories, ...newStories];

                setStories(prev => [...prev, ...newStories]);
                setSkip(prev => prev + limit);


                // ✅ auto-select passed storyId
                if (storyId && updatedStories.length > 0) {
                    const foundIndex = updatedStories.findIndex(st => st.id === storyId);
                    console.log({ foundIndex })
                    if (foundIndex !== -1) {
                        setSelectedStoryIndex(foundIndex);
                    }
                }

                if (newStories.length < limit) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.log("Error fetching stories:", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchStories();
    }, [storyId]);

    const selectedStory = stories[selectedStoryIndex] || {};
    const likedUserIds = new Set(selectedStory.likes?.map(like => like.user_id._id) || []);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <BackHeader />
            <View style={{ alignSelf: 'center', flex: 1 / 2 }}>
                <FlatList
                    data={stories}
                    horizontal
                    keyExtractor={(item, index) => item.id + index}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={[st.container, st.alignC]}>
                                <TouchableOpacity onPress={() => setSelectedStoryIndex(index)}>
                                    <Image
                                        source={{ uri: item.media }}
                                        style={[
                                            styles.storyThumb,
                                            index === selectedStoryIndex && styles.activeThumb,
                                        ]}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                                <View style={st.cardContent}>
                                    <Image source={ImageConstants.openEye} />
                                    <Text style={st.labelStyle}> {selectedStory?.viewers?.length}</Text>
                                </View>
                            </View>
                        )
                    }}
                    onEndReached={fetchStories}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading ? <ActivityIndicator size="small" color="black" /> : null
                    }
                />
            </View>

            <Text style={[st.labelStyle, styles.heading]}>{selectedStory?.viewers?.length} Viewers</Text>
            <FlatList
                data={selectedStory.viewers || []}
                keyExtractor={(item, idx) => item.user_id._id + idx}
                renderItem={({ item }) => {
                    const hasLiked = likedUserIds.has(item.user_id._id);

                    console.log({ item })

                    console.log({ hasLiked })
                    return (
                        <View style={styles.viewerRow}>
                            <Image
                                source={{ uri: item.user_id.profile_picture }}
                                style={styles.avatar}
                            />
                            {hasLiked && (
                                <Image
                                    source={ImageConstants.filled_like} 
                                    style={{
                                        position:'absolute', left:'13%', bottom:5,
                                        width:wp(18)
                                    }}
                                    resizeMode={'center'}
                                    tintColor={colors.primaryColor}
                                />
                            )}
                            <Text style={st.labelStyle}>{item.user_id.name}</Text>

                        </View>
                    )
                }}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
                        No viewers yet
                    </Text>
                }
            />
        </View>
    );
}

export default StoryViewerScreen

const styles = StyleSheet.create({
    storyThumb: {
        width: 120,
        height: 150,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: "transparent",
        borderRadius: 5,
    },
    activeThumb: {
        borderColor: colors.primaryColor,
    },
    heading: {
        marginTop: 20,
        marginLeft: 15,
    },
    viewerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    name: {
        fontSize: 14,
    },
});
