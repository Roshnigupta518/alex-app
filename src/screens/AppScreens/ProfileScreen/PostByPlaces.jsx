import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Platform,
    StyleSheet,
    FlatList, Dimensions
} from 'react-native';
import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import ImageConstants from '../../../constants/ImageConstants';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { GetUserPostsRequest } from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import MediaItem from '../../../components/GridView';
import NotFoundAnime from '../../../components/NotFoundAnime';
import st from '../../../global/styles';

const PostByPlaces = ({ navigation, route }) => {
    const userInfo = useSelector(state => state.UserInfoSlice.data);
    const [postData, setPostData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const { id, type, userId } = route?.params

    const getUsersPosts = async () => {
        setIsLoading(true)
        let url
        if (type == 'Cities') {
            url = `${userId}?city=${id}`
        } else {
            url = `${userId}?country=${id}`
        }
        GetUserPostsRequest(url)
            .then(res => {
                setPostData(res?.result);
                setIsLoading(false)
            })
            .catch(err => {
                console.log('err', err);
                Toast.error('Post', err?.message);
                setIsLoading(false)
            });
    };

    useEffect(() => {
        getUsersPosts();
    }, [id, type, userId]);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <BackHeader
                label={`Posts of ${id}`}
                />
                {/* <View style={[st.card,{paddingHorizontal:20}]}>
                    <View
                        style={st.cardContent}>
                        <View style={st.cardBar} />
                        <View
                            style={st.internalCard}>

                            <Text
                                numberOfLines={2}
                                style={st.cardTitle}>
                                {id}
                            </Text>
                        </View>
                    </View>
                </View> */}
                <View
                    style={{
                        flex: 1,
                    }}>
                    <FlatList
                        data={postData}
                        renderItem={({ item, index }) => (
                            <MediaItem
                                item={item}
                                onPress={() =>
                                    navigation.navigate('ReelViewer', {
                                        data: postData,
                                        currentIndex: index,
                                    })
                                }
                                index={index}
                            />
                        )}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ padding: 15 }}
                        ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
                    />


                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default PostByPlaces;
