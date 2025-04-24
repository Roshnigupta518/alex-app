import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {colors, fonts, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import {getAllUsersRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';

const SearchScreen = ({navigation}) => {
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [searchTxt, setSearchTxt] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState([]);

  const getAllUsers = () => {
    setIsLoading(true);
    getAllUsersRequest()
      .then(res => {
        setUsers(res?.result);
        setSearchedUser(res?.result);
      })
      .catch(err => {
        Toast.error('Users', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const searchUser = txt => {
    let users_res = users?.filter(item => item?.anonymous_name?.includes(txt));
    setSearchedUser(txt?.length < 1 ? [...users] : [...users_res]);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <BackHeader />

      <View
        style={{
          flex: 1,
          padding: wp(15),
        }}>
        <SearchInput
          value={searchTxt}
          onChangeText={txt => {
            searchUser(txt);
            setSearchTxt(txt);
          }}
        />

        <View
          style={{
            flex: 1,
            marginTop: wp(20),
          }}>
          <FlatList
            data={searchedUser}
            ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserProfileDetail', {
                      userId: item?._id,
                    })
                  }
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors.lightBlack,
                    padding: wp(15),
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: wp(16),
                      color: colors.white,
                    }}>
                    {item?.anonymous_name}
                  </Text>

                  <Image
                    source={ImageConstants.leftArrow}
                    style={{
                      transform: [{rotate: '135deg'}],
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
