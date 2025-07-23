import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import BackHeader from '../../../components/BackHeader';
import ReadMore from '@fawazahmed/react-native-read-more';
import VideoPlayer from '../../../components/ReelComponent/VideoPlayer';
import ImageConstants from '../../../constants/ImageConstants';
import { colors } from '../../../constants';
import styles from '../../../components/ReelComponent/ReelStyle/ReelCard.Style';
import { getPostByIdRequest } from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';

const PostDetailScreen = ({ navigation }) => {
    const route = useRoute();
    const [shouldPlay, setShouldPlay] = useState(false);
    const [muteIconVisible, setMuteIconVisible] = useState(false);
    const [shouldMute, setShouldMute] = useState(true);
    const [postData, setPostData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const { post_id } = route.params || {};

    const getData = (id) => {
        setIsLoading(true);
        getPostByIdRequest(id)
            .then(res => {
                console.log({ res })
                setPostData(res?.result?.postData);
            })
            .catch(err => {
                Toast.error('Users', err?.message);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getData(post_id)
    }, [post_id])

    useEffect(() => {
        if (postData?.post?.mimetype === 'video/mp4') {
            setShouldPlay(true);
        } else {
            setShouldPlay(false);
        }
    }, [postData]);

    if (!postData && !isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Post not found.</Text>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return <NotFoundAnime isLoading={isLoading} />;
      }

    const changeMuteState = () => {
        setMuteIconVisible(true);
        setShouldMute(prev => !prev);
        setTimeout(() => {
            setMuteIconVisible(false);
        }, 2000);
    };

    const formatPostDate = (isoDate) => {
        const createdAt = new Date(isoDate);
        const now = new Date();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day ago`;

        return moment(createdAt).format("MMM DD, YYYY");
    };

    const screenHeight = '90%'

    return (
        <SafeAreaView style={styles.container}>
            <BackHeader label="Post Detail" onPress={() => navigation.goBack()} />

            <View style={[styles.container, { height: screenHeight }]}>
                {postData?.post?.mimetype === 'video/mp4' ? (
                    <VideoPlayer
                        url={postData?.post?.data}
                        shouldPlay={shouldPlay}
                        shouldMute={shouldMute}
                        onMuteClick={changeMuteState}
                        screenHeight={screenHeight}
                    />
                ) : (
                    <Image
                        source={{ uri: postData?.post?.data }}
                        style={[styles.uploadedImageStyle(), { height: screenHeight }]}
                    />
                )}

                <View style={[styles.firstRowContainer()]}>
                    <View style={styles.subFirstRowContiner}>
                        <View style={styles.userImageContainer}>
                            <View style={styles.imageView}>
                                <TouchableOpacity>
                                    <Image
                                        source={
                                            postData?.user_id?.profile_picture
                                                ? { uri: postData?.user_id?.profile_picture }
                                                : ImageConstants.user
                                        }
                                        style={styles.imageStyle}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.usernameStyle}>
                                <TouchableOpacity>
                                    <Text numberOfLines={1} style={styles.nameTxtStyle}>
                                        {postData?.added_from === '1'
                                            ? postData?.user_id?.anonymous_name
                                            : postData?.tagBussiness?.[0]?.name}
                                    </Text>
                                </TouchableOpacity>
                                <Text numberOfLines={1} style={styles.locationTxtStyle}>
                                    {postData?.city}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <ReadMore
                        numberOfLines={2}
                        style={styles.descriptionTxtStyle}
                        seeMoreStyle={{ color: colors.primaryColor }}
                        seeLessStyle={{ color: colors.primaryColor }}
                    >
                        {postData?.caption}
                    </ReadMore>

                    <Text numberOfLines={1} style={styles.locationTxtStyle}>
                        {formatPostDate(postData?.created_at)}
                    </Text>
                </View>

                {muteIconVisible && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={changeMuteState}
                        style={styles.muteContainer}>
                        <Image
                            source={shouldMute ? ImageConstants.audio_off : ImageConstants.audio_on}
                            style={styles.muteIconStyle}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default PostDetailScreen;
