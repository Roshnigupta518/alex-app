import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Image,
    Touchable,
    TouchableOpacity,
} from 'react-native';
import { colors, fonts, HEIGHT, WIDTH, wp } from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import Toast from '../../../constants/Toast';
import ImageConstants from '../../../constants/ImageConstants';
import NotFoundAnime from '../../../components/NotFoundAnime';
import st from '../../../global/styles';
import { getAllPlacesRequest, getAllCitiesRequest, getAllCountryRequest } from '../../../services/Utills';
import PlacesItem from '../../../components/placesItems'

const UserPlaces = ({ navigation, route }) => {

    const [searchTxt, setSearchTxt] = useState('');
    const [users, setUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const type = route?.params?.type
    const id = route?.params?.id

    const getAllPlaces = () => {
        setIsLoading(true)
        getAllPlacesRequest(id)
            .then(res => {
                setUsers(res?.result);
                setSearchedUser(res?.result);
                setIsLoading(false)
            })
            .catch(err => {
                Toast.error('places List', err?.message)
                setIsLoading(false)
            });
    };

    const getAllCountry = () => {
        setIsLoading(true)
        getAllCountryRequest(id)
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

    const getAllCities = () => {
        setIsLoading(true)
        getAllCitiesRequest(id)
            .then(res => {
                setUsers(res?.result);
                console.log({ getAllCities: res })
                setSearchedUser(res?.result);
                setIsLoading(false)
            })
            .catch(err => {
                Toast.error('getAllCities', err?.message)
                console.log({ err });

                setIsLoading(false)
            });
    };

    useEffect(() => {
        if (type == 'Places') {
            getAllPlaces()
        } else if (type == 'Countries') {
            getAllCountry()
        } else if (type == 'Cities') {
            getAllCities()
        }
    }, [id, type])

    const searchUser = txt => {
        if (txt) {
            const newData = users.filter(
                function (item) {
                    const itemData = item._id
                        ? item._id.toUpperCase()
                        : ''.toUpperCase();
                    const textData = txt.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });

            setSearchedUser(newData);
        } else {
            setSearchedUser(users);
        }
    };

    const _renderUserList = useCallback(({ item, index }) => {
        return (
            <PlacesItem item={item}
                index={index}
                onPress={() => navigation.navigate('PostByPlaces',{id:item._id, type})} />
        )
    })

    return (
        <>
            <SafeAreaView style={st.container}>
                <BackHeader label={type} />

                <View style={st.content}>
                    <SearchInput
                        value={searchTxt}
                        onChangeText={txt => {
                            setSearchTxt(txt);
                            searchUser(txt)
                        }}
                    />

                </View>

                <FlatList
                    data={searchedUser}
                    ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
                    renderItem={_renderUserList}
                    keyExtractor={item => item._id}
                    contentContainerStyle={st.content}
                />
            </SafeAreaView>
        </>
    )
}

export default UserPlaces;