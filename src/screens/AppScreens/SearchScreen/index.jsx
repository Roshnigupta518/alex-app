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
import {getAllUsersRequest, getAllBussinessRequest, getAllGlobalSearchRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NotFoundAnime from '../../../components/NotFoundAnime';
import CustomContainer from '../../../components/container';
const SearchScreen = ({navigation, route}) => {
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [searchTxt, setSearchTxt] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);

  const isBusiness = route?.params?.isBusiness

  console.log({isBusiness})

  const getAllUsers = (search) => {
    setIsLoading(true);
    getAllGlobalSearchRequest(search)
      .then(res => {
        const results = res.result.results;
        const businesses = results.businesses.map(item => ({
          ...item,
          type: 'business',
        }));
        const users = results.users.map(item => ({
          ...item,
          type: 'user',
        }));
  
        const mergedResults = [...users, ...businesses];
  
        setSearchedUser(mergedResults);
      })
      .catch(err => {
        Toast.error('Users', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const getAllBusiness = (search) => {
    setIsLoading(true);
    getAllBussinessRequest(search)
      .then(res => {
        // setUsers(res?.result);
        setSearchedUser(res?.result);
        // setSearchedUser(res?.result);
      })
      .catch(err => {
        Toast.error('Users', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const searchUser = txt => {
    if (txt.length < 3) {
      setSearchedUser([]); // show nothing until 3 chars
      return;
    }
  
    const filteredUsers = users?.filter(item =>
      item?.anonymous_name?.toLowerCase()?.includes(txt.toLowerCase()),
    );
     
    if(isBusiness){
      getAllBusiness(txt)
     }else{
    //  setSearchedUser(filteredUsers);
    getAllUsers(txt)
      }
  };
  
  // useEffect(() => {
  //   if(!isBusiness){
  //   getAllUsers();
  // }else{
  //   setIsLoading(false)
  // }
  // }, []);

  const ListEmptyComponent = () => {
    if (isLoading) {
      return <NotFoundAnime isLoading={isLoading} />;
    }
    if (searchTxt.length >= 3 && searchedUser.length === 0) {
    return(
      <NotFoundAnime isLoading={isLoading} />
    )
  }

  if (searchTxt.length > 0 && searchTxt.length < 3) {
    return (
      <Text
        style={{
          color: colors.gray,
          fontFamily: fonts.regular,
          fontSize: wp(12),
          textAlign: 'center',
          marginTop: wp(40),
        }}>
        Please type at least 3 characters to search
      </Text>
    );
  }
  }

  return (
    <CustomContainer>
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
            // ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
            ListEmptyComponent={ListEmptyComponent}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>{
                    if(isBusiness){
                      navigation.navigate('ClaimBusinessScreen', item)
                    }else{
                      if(item.type === 'user'){
                    navigation.navigate('UserProfileDetail', {
                      userId: item?._id,
                    })
                  }else if(item.type === 'business'){
                    navigation.navigate('ClaimBusinessScreen', item)
                  }
                  }}}
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
                    <View style={{width:'90%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: wp(16),
                      color: colors.white,
                    }}>
                    {isBusiness ? item.name : item?.name}
                  </Text>
                  </View>
                  <View style={{width:'10%'}}>
                  <Image
                    source={ImageConstants.leftArrow}
                    style={{
                      transform: [{rotate: '135deg'}],
                    }}
                  />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </CustomContainer>
  );
};

export default SearchScreen;
