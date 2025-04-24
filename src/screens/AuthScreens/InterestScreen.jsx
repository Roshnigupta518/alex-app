import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {colors, fonts, HEIGHT, WIDTH, wp} from '../../constants';
import ImageConstants from '../../constants/ImageConstants';
import CustomButton from '../../components/CustomButton';
import LottieView from 'lottie-react-native';
import animation from '../../constants/AnimationConstants';
import {GetCategoriesRequest} from '../../services/Utills';
import NotFoundAnime from '../../components/NotFoundAnime';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../components/NoInternetModal';
import crashlytics from '@react-native-firebase/crashlytics';
const InterestScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
  const AddRemoveCategory = id => {
    let temp_list = selectedCategories;
    if (temp_list?.includes(id)) {
      let idx = temp_list.indexOf(id);
      temp_list.splice(idx, 1);
    } else {
      temp_list.push(id);
    }

    setSelectedCategories([...temp_list]);
  };

  const getCategoriesList = async () => {
    await GetCategoriesRequest()
      .then(res => {
        setCategoryList(res?.result);
      })
      .catch(err => {
        console.log('err: ', err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getCategoriesList();
  }, []);

  const _renderInterestList = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => AddRemoveCategory(item?._id)}
        style={styles.itemContainer}>
        <ImageBackground
          source={{
            uri: item?.icon,
          }}
          style={styles.itemImageStyle}
          imageStyle={{borderRadius: 10}}>
          {selectedCategories?.includes(item?._id) && (
            <View style={styles.checkImageContiner}>
              <Image source={ImageConstants.check} />
            </View>
          )}
        </ImageBackground>
        <Text numberOfLines={2} style={styles.itemTxtStyle}>
          {item?.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BackHeader
          rightView={() => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SetupProfileScreen', {
                    dob: route?.params?.dob,
                    selectedCategories,
                  })
                }
                style={styles.rightHeaderStyle}>
                <Text style={styles.skipTxtStyle}>Skip</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View>
          <Text style={styles.titleStyle}>What are your Interests?</Text>
        </View>

        <FlatList
          data={categoryList || []}
          style={styles.flatListStyle}
          renderItem={_renderInterestList}
          ListEmptyComponent={<NotFoundAnime isLoading={isLoading} />}
          numColumns={3}
        />

        <View style={styles.buttonViewStyle}>
          <CustomButton
            label="Continue"
            disabled={isLoading}
            onPress={() =>
              navigation.navigate('SetupProfileScreen', {
                dob: route?.params?.dob,
                selectedCategories,
              })
            }
          />
        </View>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  lottieStyle: {
    height: WIDTH / 1.2,
    width: WIDTH / 1.2,
  },

  rightHeaderStyle: {
    paddingHorizontal: wp(20),
  },

  emptyTxtView: {
    height: HEIGHT / 3,
    justifyContent: 'center',
  },

  emptyTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(14),
    color: colors.black,
  },

  skipTxtStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(15),
    color: colors.black,
  },

  titleStyle: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    color: colors.black,
    fontSize: wp(22),
    marginTop: wp(20),
  },

  flatListStyle: {
    marginTop: wp(20),
    height: HEIGHT / 1.8,
  },

  buttonViewStyle: {
    flex: 1,
    marginTop: 20,
  },

  itemContainer: {
    width: WIDTH / 3.6,
    margin: 10,
    alignItems: 'center',
  },

  itemImageStyle: {
    height: 100,
    width: 100,
    alignItems: 'flex-end',
  },

  checkImageContiner: {
    backgroundColor: colors.primaryColor,
    padding: 5,
    borderRadius: 30,
    margin: 10,
  },

  itemTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: wp(13),
    color: colors.black,
    marginHorizontal: wp(4),
    textAlign: 'center',
  },
});
export default InterestScreen;
