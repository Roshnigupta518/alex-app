import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import BusinessHeader from '../commonComponents/BusinessHeader';
import SearchInput from '../../../components/SearchInput';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../../constants';
import ImageConstants from '../../../constants/ImageConstants';
import {
  DeleteBusinessRequest,
  getMyBusinessListRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DeleteBusinessSheet from '../../../components/ActionSheetComponent/DeleteBusinessSheet';

const BusinessUserListingScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const swipeRef = useRef();
  const deleteSheet = useRef();
  const userInfo = useSelector(state => state.UserInfoSlice.data);
  const [eventList, setEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [eventSearchList, setEventSearchList] = useState([]);
  const [searchTxt, setSearchTxt] = useState('');

  const getBusinessList = () => {
    try {
      setIsLoading(true);
      setEventList([]);
      setEventSearchList([]);
      getMyBusinessListRequest()
        .then(res => {
          setEventList(res?.result || []);
          setEventSearchList(res?.result || []);
          swipeRef?.current?.manuallyOpenAllRows(0);
        })
        .catch(err => {
          Toast.error('Business', err?.message);
        })
        .finally(() => setIsLoading(false));
    } catch (err) {
      Toast.error('Business', JSON.stringify(err));
      setIsLoading(false);
    }
  };

  const searchEvent = txt => {
    let search_res = eventList?.filter(item => item?.name?.includes(txt));
    setEventSearchList(txt?.length < 1 ? [...eventList] : [...search_res]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBusinessList();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   if (isFocused) {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       getBusinessList();
  //     }, 800);
  //   }
  // }, [isFocused]);

  const EmptyView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          height: HEIGHT / 2,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: wp(16),
            color: colors.black,
          }}>
          No Business has been listed!
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BusinessCategoryScreen', {
              addBusiness: true,
              shouldGoBack: true,
            })
          }>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(16),
              color: colors.primaryColor,
              marginTop: 10,
            }}>
            Add Your Business
          </Text>
        </TouchableOpacity>

        <View
          style={{
            marginTop: wp(40),
          }}>
          <Image
            source={ImageConstants.not_found}
            style={{
              height: wp(140),
              width: wp(140),
              resizeMode: 'contain',
              tintColor: colors.primaryColor,
            }}
          />
        </View>
      </View>
    );
  };

  const _renderEventList = ({item, index}) => {
    console.log('item?.certificate', item?.certificate);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BusinessDetailScreen', {data: item})
        }
        activeOpacity={1}
        style={{
          backgroundColor: colors.lightGray,
          padding: wp(5),
          borderRadius: 10,
          flexDirection: 'row',
          marginVertical: 10,
          height: 112,
        }}>
        {item?.certificate != '' ? (
          <Image
            source={{
              uri: item?.certificate,
            }}
            style={{
              height: 90,
              width: 90,
              borderRadius: 10,
              resizeMode: 'stretch',
            }}
          />
        ) : (
          <Image
            source={ImageConstants.business_logo}
            style={{
              width: 90,
              borderRadius: 10,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 30,
            }}
          />
        )}

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
            numberOfLines={4}
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
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <BusinessHeader
        label="Business Listing"
        onAction={() =>
          navigation.navigate('BusinessCategoryScreen', {
            addBusiness: true,
            shouldGoBack: true,
          })
        }
      />

      <View
        style={{
          margin: wp(20),
        }}>
        <SearchInput
          value={searchTxt}
          onChangeText={txt => {
            searchEvent(txt);
            setSearchTxt(txt);
          }}
        />
      </View>

      <View
        style={{
          padding: wp(15),
          flex: 1,
        }}>
        <SwipeListView
          ref={swipeRef}
          data={eventSearchList}
          showsVerticalScrollIndicator={false}
          renderItem={_renderEventList}
          disableRightSwipe={true}
          ListEmptyComponent={<EmptyView />}
          renderHiddenItem={({item}, rowMap) => {
            return (
              <View style={styles.drawerStyle}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    rowMap[item?._id]?.closeRow();
                    deleteSheet.current?.show(item?._id);
                  }}
                  style={styles.deleteIconView}>
                  <Image
                    source={ImageConstants.delete}
                    style={styles.iconStyle}
                  />
                  <Text style={styles.itemNameStyle}>Delete</Text>
                </TouchableOpacity>
                <View style={{width: 2}} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('AddBusinessScreen', {
                      data: item,
                      isEdit: true,
                    })
                  }
                  style={styles.deleteIconView}>
                  <Image
                    source={ImageConstants.edit_comment}
                    style={styles.iconStyle}
                  />
                  <Text style={[styles.itemNameStyle, {paddingHorizontal: 10}]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <View style={{width: 10}} />
              </View>
            );
          }}
          leftOpenValue={75}
          rightOpenValue={-150}
          keyExtractor={item => item?._id}
          ListFooterComponent={<View style={{height: 160}} />}
        />
      </View>
      <DeleteBusinessSheet ref={deleteSheet} onDelete={getBusinessList} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height: wp(100),
    // width: WIDTH / 3,
    marginTop: 10,
  },

  deleteIconView: {
    height: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: colors.primaryColor,
  },

  iconStyle: {
    height: wp(20),
    width: wp(20),
  },

  itemNameStyle: {
    fontFamily: fonts.semiBold,
    fontSize: wp(13),
    color: colors.white,
    marginTop: 10,
  },

  lineSaparatorStyle: {
    backgroundColor: colors.white,
    width: 2,
  },

  commentInputView: {
    padding: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.black,
  },

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    width: WIDTH / 6,
    textAlign: 'right',
  },
});

export default BusinessUserListingScreen;
