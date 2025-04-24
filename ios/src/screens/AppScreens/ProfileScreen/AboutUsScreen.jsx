import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {colors, fonts, wp} from '../../../constants';
import BackHeader from '../../../components/BackHeader';
import {OurMissionRequest, ourVisionRequest} from '../../../services/Utills';
import Toast from '../../../constants/Toast';
import NoInternetModal from '../../../components/NoInternetModal';
import NetInfo from '@react-native-community/netinfo';
const AboutUsScreen = ({navigation, route}) => {
  const [missionTxt, setMissionTxt] = useState('');
  const [visionTxt, setVisionTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  const getMission = () => {
    setIsLoading(true);
    OurMissionRequest()
      .then(res => {
        setMissionTxt(res?.result?.description);
      })
      .catch(err => {
        Toast.error('Mission', err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const getVision = () => {
    ourVisionRequest()
      .then(res => {
        setVisionTxt(res?.result?.description);
      })
      .catch(err => {
        Toast.error('Vision', err?.message);
      });
  };

  useEffect(() => {
    getMission();
    getVision();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <BackHeader label="About Us" />
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={'large'} color={colors.primaryColor} />
          </View>
        ) : (
          <ScrollView>
            <View
              style={{
                padding: wp(20),
              }}>
              <View>
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(18),
                      color: colors.black,
                      padding: wp(14),
                    }}>
                    Our Mission
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
                      {missionTxt}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Our Vision */}
              <View>
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    marginTop: wp(20),
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: wp(18),
                      color: colors.black,
                      padding: wp(14),
                    }}>
                    Our Vision
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
                      {visionTxt}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
      {/* <NoInternetModal shouldShow={!isInternetConnected} /> */}
    </>
  );
};

export default AboutUsScreen;
