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
import { useSelector } from "react-redux";
import Toast from "../../../constants/Toast";
import { DeleteStoryRequest } from "../../../../ios/src/services/Utills";
import InstaThumbnailSlider from "../../../components/InstaThumbnailSlider";

const StoryViewerScreen = ({ navigation, route }) => {
    const { storyId, onDelete } = route.params || {};
    const [stories, setStories] = useState([]);
    const [skip, setSkip] = useState(0);
    const limit = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const userInfo = useSelector(state => state.UserInfoSlice.data);

    const DeleteStoryById = (storyId) => {
        if (!storyId) return;

        DeleteStoryRequest(storyId)
            .then(res => {
                Toast.success('Story', res?.message);

                setStories(prev => {
                    const updated = prev.filter(story => story.id !== storyId);

                    // 🔹 Home screen ko update karo
                    if (onDelete) onDelete(storyId, userInfo?.id);

                    // 🔹 Agar koi story bachi hi nahi -> goBack()
                    if (updated.length === 0) {
                        navigation.goBack();
                    }

                    return updated;
                });
            })
            .catch(err => {
                console.log('err', err);
                Toast.error('Story', err?.message);
            });
    };


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
                // 🔹 Filter only my stories
                const myStoriesOnly = res.result.filter(user => user.user_id === userInfo.id);

                const newStories = transformStories(myStoriesOnly);
                const updatedStories = [...stories, ...newStories];

                setStories(prev => [...prev, ...newStories]);
                setSkip(prev => prev + limit);

                // ✅ auto-select passed storyId
                if (storyId && updatedStories.length > 0) {
                    const foundIndex = updatedStories.findIndex(st => st.id === storyId);
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
            <View 
            style={{  flex: 1 / 2 }}>


                <InstaThumbnailSlider
                    stories={stories}
                    selectedIndex={selectedStoryIndex}
                    setSelectedIndex={setSelectedStoryIndex}
                />
            </View>

            <View style={st.businessTimeCon}>
                <Text style={[st.labelStyle, styles.heading]}>{selectedStory?.viewers?.length} Viewers</Text>
                <View style={st.alignE}>
                    <TouchableOpacity onPress={() => DeleteStoryById(selectedStory?.id)}>
                        <Image source={ImageConstants.delete_new} style={styles.trashicon}
                            tintColor={colors.black}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={selectedStory.viewers || []}
                keyExtractor={(item, idx) => item.user_id._id + idx}
                renderItem={({ item }) => {
                    const hasLiked = likedUserIds.has(item.user_id._id);

                    // console.log({ item })

                    // console.log({ hasLiked })
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
                                        position: 'absolute', left: '12%', bottom: 0,
                                        width: wp(18)
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
        borderRadius: 5,
    },
    activeThumb: {
        borderColor: colors.primaryColor,
    },
    gradientBorder: {
        padding: 3, 
        borderRadius: 10,
        marginHorizontal: 8,
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
    trashicon: {
        height: wp(22),
        width: wp(22),
        alignSelf: 'center',
        marginVertical: wp(30),
        marginTop: 20,
        marginRight: 15
    }
});
