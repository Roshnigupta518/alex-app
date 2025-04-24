import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors, fonts, WIDTH, wp} from '../../../constants';
import {
  GetAllChildBusiness,
  getBusinessListingByIdRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import NotFoundAnime from '../../../components/NotFoundAnime';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const BusinessListWithChild = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  const [businessList, setBusinessList] = useState([]);
  const [searchBusinessList, setSearchBusinessList] = useState([]);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable != undefined) {
        console.log('see state of Internet: ', state.isInternetReachable);
        setIsInternetConnected(state.isInternetReachable);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  const getBusinessList = () => {
    setIsLoading(true);
    GetAllChildBusiness(route?.params?.childId)
      .then(res => {
        console.log('res?.result=-=-=-', JSON.stringify(res?.result));
        setBusinessList(res?.result);
        setSearchBusinessList(res?.result);
      })
      .catch(err => {
        Toast.error('Business Listing', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getBusinessList();
  }, []);

  const searchBusiness = txt => {
    let searchBusinessRes = businessList.filter(item =>
      item?.name?.includes(txt),
    );
    setSearchBusinessList(
      txt?.length < 1 ? [...businessList] : [...searchBusinessRes],
    );
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Business Type" />

        <View
          style={{
            margin: wp(20),
            flex: 1,
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              searchBusiness(txt);
              setSearchTxt(txt);
            }}
          />

          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={searchBusinessList}
              ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
              contentContainerStyle={{marginTop: wp(30)}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('BusinessDetailScreen', {data: item})
                    }
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: colors.lightGray,
                      padding: wp(5),
                      borderRadius: 20,
                      flexDirection: 'row',
                      marginVertical: 10,
                    }}>
                    <Image
                      source={{
                        uri: item?.certificate,
                      }}
                      style={{
                        height: WIDTH / 3.8,
                        width: WIDTH / 4,
                        borderRadius: 10,
                      }}
                    />

                    <View
                      style={{
                        flex: 1,
                        margin: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: wp(14),
                          color: colors.black,
                        }}>
                        {item?.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: wp(12),
                          color: colors.black,
                        }}>
                        {item?.details}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={<View style={{marginBottom: 20}} />}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default BusinessListWithChild;
