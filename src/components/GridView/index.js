import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import ImageConstants from '../../constants/ImageConstants';
import { wp, WIDTH, colors } from '../../constants';

const MediaItem = ({ item, size, onPress, index }) => {
    return (
        <TouchableOpacity
            onPress={onPress}>
            {item?.postData?.post?.mimetype != 'video/mp4' ? (
                <Image
                    source={{ uri: item?.postData?.post?.data }}
                    style={styles.userPostImage}
                />
            ) : (
                <View style={styles.videoContainer}>
                    <View style={styles.playIconStyle}>
                        <Image
                            source={ImageConstants.play}
                            style={{
                                height: wp(60),
                                width: wp(60),
                                alignSelf: 'center',
                            }}
                        />
                    </View>
                    <Image
                        source={{ uri: item?.postData?.post_thumbnail }}
                        style={{
                            height: 200,
                            width: WIDTH / 2.2,
                            borderRadius: 10,
                        }}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    media: {
        width: '100%',
        height: '100%',
    },
    userPostImage: {
        height: 120,
        width: WIDTH / 3.5,
        margin: 4,
      },
      videoContainer: {
        padding: 4,
        borderWidth: 1,
        borderColor: colors.primaryColor,
        borderRadius: 10,
        margin: 4,
      },
      playIconStyle: {
        position: 'absolute',
        top: 75,
        width: WIDTH / 2.1,
        zIndex: 2,
      }
});

export default MediaItem;
