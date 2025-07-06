import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from "react-native";
import st from "../../../global/styles";
import SearchInput from "../../../components/SearchInput";
import NotFoundAnime from "../../../components/NotFoundAnime";
import BackHeader from "../../../components/BackHeader";
import { getAllBusinessFollowerRequest } from "../../../services/Utills";
import ImageConstants from "../../../constants/ImageConstants";
import Toast from "../../../constants/Toast";

const FollowBusiness = ({ navigation, route }) => {
    const [searchedUser, setSearchedUser] = useState([])
    const [users, setUsers] = useState([])
    const [searchTxt, setSearchTxt] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const id = route?.params?.id

    const getAllFollowers = () => {
        setIsLoading(true)
        getAllBusinessFollowerRequest('66c5fbc6ce4bcc658fab35f6')
            .then(res => {
                setUsers(res?.result);
                setSearchedUser(res?.result);
                setIsLoading(false)
            })
            .catch(err => {
                Toast.error('Follow List', err?.message)
                setIsLoading(false)
            });
    };

    useEffect(() => {
        getAllFollowers();
    }, [id])

    const searchUser = txt => {
        if (txt) {
            const newData = users.filter(
                function (item) {
                    const itemData = item?.user_id?.anonymous_name
                        ? item?.user_id?.anonymous_name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = txt.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });

            setSearchedUser(newData);
        } else {
            setSearchedUser(users);
        }
    };

    const _renderUserList = ({ item, index }) => {
        return (
            <TouchableOpacity style={st.card} 
            onPress={()=> navigation.navigate('UserProfileDetail', {
                userId: item?.user_id?._id ,
              })} >
                <View style={st.cardContent}>
                    <View style={st.cardBar} />
                    <View style={st.internalCard}>

                        {item?.user_id?.profile_picture && (
                            <Image
                                source={{
                                    uri: item?.user_id?.profile_picture,
                                }} style={st.profileSty} />
                        )}

                        {!item?.user_id?.profile_picture && (
                            <Image source={ImageConstants.user}
                                style={st.profileSty}/>
                        )}
                        <Text numberOfLines={2} style={st.cardTitle}>
                            {item?.user_id?.anonymous_name ||
                                item?.user_id?.anonymous_name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <SafeAreaView
                style={st.container}>
                <BackHeader label={'Business Followers'} />
                <View style={st.content}>
                    <SearchInput
                        value={searchTxt}
                        onChangeText={txt => {
                            searchUser(txt);
                            setSearchTxt(txt);
                        }}
                    />

                    <FlatList
                        data={searchedUser}
                        ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
                        renderItem={_renderUserList}
                        keyExtractor={item => item._id}
                        contentContainerStyle={st.mt_10}
                    />

                </View>
            </SafeAreaView>
        </>
    )
}

export default FollowBusiness;