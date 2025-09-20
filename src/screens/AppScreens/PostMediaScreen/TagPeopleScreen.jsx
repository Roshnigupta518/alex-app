import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import SearchInput from '../../../components/SearchInput';
import {getAllUsersRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import ImageConstants from '../../../constants/ImageConstants';
import CustomButton from '../../../components/CustomButton';
import {useDispatch} from 'react-redux';
import {tagPeopleAction} from '../../../redux/Slices/TagPeopleSlice';
import {useSelector} from 'react-redux';
import NotFoundAnime from './../../../components/NotFoundAnime';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
import CustomContainer from '../../../components/container';

const TagPeopleScreen = ({navigation}) => {
  const tagPeopleList = useSelector(state => state.TagPeopleSlice?.data);
  const dispatch = useDispatch();
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUsers, setSearchedUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTxt, setSearchTxt] = useState('');
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected === false) {
        // Set internet connection status to false when not connected
        setIsInternetConnected(false);
        console.log('No internet connection');
      } else if (
        state.isConnected === true &&
        state.isInternetReachable !== undefined
      ) {
        // Only update when connection is reachable
        console.log(
          'State of Internet reachability: ',
          state.isInternetReachable,
        );

        // Set connection status based on reachability
        setIsInternetConnected(state.isInternetReachable);
      }
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);
  const getAllUser = async () => {
    setIsLoading(true);
    getAllUsersRequest()
      .then(res => {
        setAllUsers(res?.result);
        setSearchedUser(res?.result);
      })
      .catch(err => {
        Toast.error('Users', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const searchFilter = txt => {
    let data = allUsers?.filter(item => item?.anonymous_name?.includes(txt));
    setSearchedUser(txt?.length < 1 ? [...allUsers] : [...data]);
  };

  const SelectUser = data => {
    let temp_users = selectedUsers;
    if (temp_users?.some(item => item?._id == data?._id)) {
      let idx = temp_users?.findIndex(item => item?._id == data?._id);
      if (idx > -1) {
        temp_users?.splice(idx, 1);
      }
    } else {
      temp_users.push(data);
    }
    setSelectedUsers([...temp_users]);
  };

  useEffect(() => {
    setSelectedUsers([...tagPeopleList]);
    getAllUser();
  }, []);

  return (
    <>
      <CustomContainer>
        <BackHeader />

        <View
          style={{
            flex: 1,
            margin: wp(20),
          }}>
          <SearchInput
            value={searchTxt}
            onChangeText={txt => {
              searchFilter(txt);
              setSearchTxt(txt);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: wp(20),
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: wp(16),
                color: colors.black,
              }}>
              {selectedUsers?.length > 0 && `${selectedUsers?.length} People`}
            </Text>

            <TouchableOpacity
              onPress={() => {
                dispatch(tagPeopleAction([]));
                setSelectedUsers([]);
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: wp(14),
                  color: colors.primaryColor,
                }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={searchedUsers}
              ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => SelectUser(item)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.white,
                      shadowColor: colors.black,
                      shadowOffset: {width: 1, height: 1},
                      shadowOpacity: 0.1,
                      shadowRadius: 30,
                      elevation: 3,
                      marginVertical: wp(5),
                      marginHorizontal: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 6,
                          minHeight: wp(60),
                          backgroundColor: colors.primaryColor,
                          borderTopLeftRadius: 10,
                          borderBottomLeftRadius: 10,
                        }}
                      />

                      <Text
                        numberOfLines={2}
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: wp(16),
                          color: colors.black,
                          width: WIDTH / 1.7,
                          marginLeft: 10,
                        }}>
                        {item?.anonymous_name}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginRight: wp(10),
                      }}>
                      {selectedUsers?.some(temp => temp?._id == item?._id) ? (
                        <Image
                          source={ImageConstants.check_round}
                          style={{
                            height: wp(25),
                            width: wp(25),
                            resizeMode: 'contain',
                            tintColor: colors.primaryColor,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            borderWidth: 2,
                            borderColor: colors.primaryColor,
                            padding: 10,
                            borderRadius: 30,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={{marginTop: 20}}>
              <CustomButton
                label="Add People"
                onPress={() => {
                  dispatch(tagPeopleAction(selectedUsers));
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </CustomContainer>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};
export default TagPeopleScreen;
