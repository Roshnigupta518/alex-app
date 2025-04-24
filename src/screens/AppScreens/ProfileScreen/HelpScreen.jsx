import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {colors, fonts, HEIGHT, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import {BusinessUserDescriptionInput} from '../../BusinessUserScreen/commonComponents/BusinessUserInputs';
import CustomButton from '../../../components/CustomButton';
import {
  AddQueryRequest,
  getQuestionAnswerRequest,
} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../../../components/NoInternetModal';
const HelpScreen = ({navigation}) => {
  const [getContentLoading, setGetContentLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [questionSet, setQuestionSet] = useState([]);
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

  const getQuestion = () => {
    setGetContentLoading(true);
    getQuestionAnswerRequest()
      .then(res => {
        setQuestionSet(res?.result || []);
      })
      .catch(err => Toast.error('Question', err?.message))
      .finally(() => setGetContentLoading(false));
  };

  const addQuery = async qry => {
    if (qry?.length == 0) {
      Toast.error('Query', 'Query is required');
    } else {
      setLoading(true);
      await AddQueryRequest({query: qry})
        .then(res => {
          Toast.success('Query', res?.message);
          navigation.goBack();
        })
        .catch(err => Toast.error('Query', err?.message))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const EmptyListView = () => {
    return (
      <View
        style={{
          height: HEIGHT / 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {getContentLoading ? (
          <ActivityIndicator size={'small'} color={colors.primaryColor} />
        ) : (
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(13),
              color: colors.black,
            }}>
            No data found!
          </Text>
        )}
      </View>
    );
  };

  const _renderQuestion = ({item, index}) => {
    return (
      <View style={{marginVertical: 5, marginHorizontal: 10}}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 10,
            shadowColor: colors.black,
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 20,
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: wp(18),
              color: colors.black,
              padding: wp(14),
            }}>
            {item?.question}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: colors.gray,
            }}
          />
          <View
            style={{
              padding: wp(15),
            }}>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: wp(13),
                color: colors.black,
              }}>
              {item?.answer}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ListFooterComponent = useCallback(() => {
    const [queryTxt, setQueryTxt] = useState('');

    return (
      <View style={{marginTop: wp(30)}}>
        <Text
          style={{
            fontFamily: fonts.semiBold,
            fontSize: wp(18),
            color: colors.black,
            marginHorizontal: 15,
          }}>
          Raise your query!
        </Text>

        <TextInput
          placeholder="Write here..."
          placeholderTextColor={colors.gray}
          multiline={true}
          value={queryTxt}
          onChangeText={txt => setQueryTxt(txt)}
          style={{
            textAlignVertical: 'top',
            backgroundColor: colors.white,
            margin: wp(10),
            height: wp(140),
            borderRadius: 6,
            padding: 4,
            color: colors.black,
            shadowColor: colors.black,
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 2,
          }}
        />

        <View
          style={{
            marginTop: wp(30),
            marginBottom: wp(40),
          }}>
          <CustomButton
            label="Submit"
            isLoading={isLoading}
            disabled={isLoading}
            onPress={() => {
              addQuery(queryTxt);
            }}
          />
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="Help" />
        <KeyboardAvoidingScrollView>
          <FlatList
            data={questionSet}
            ListEmptyComponent={EmptyListView}
            renderItem={_renderQuestion}
            ListFooterComponent={<ListFooterComponent />}
          />
        </KeyboardAvoidingScrollView>
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default HelpScreen;
