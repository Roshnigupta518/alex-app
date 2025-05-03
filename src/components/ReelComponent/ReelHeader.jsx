import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants';
import styles from './ReelStyle/ReelHeader.Style';
import { useDispatch, useSelector } from 'react-redux';
import ImageConstants from '../../constants/ImageConstants';
import { useIsFocused } from '@react-navigation/native';
import { GetNotificationCountRequest } from '../../services/Utills';
import { NotificationCountAction } from '../../redux/Slices/NotificationCount';

const ReelHeader = ({
  onNearByClick = () => { },
  onSearchClick = () => { },
  notificationClick = () => { },
  onTempaClick = () => { },
  selectedCity,
  currentCity
}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const notificationCount = useSelector(
    state => state.NotificationCountSlice?.data,
  );
  const nearByType = useSelector(state => state.NearBySlice?.data);

  const getCount = () => {
    GetNotificationCountRequest()
      .then(res => {
        dispatch(NotificationCountAction(res?.result?.notification_count || 0));
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    if (isFocused) {
      getCount();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => {
          onNearByClick()
        }} style={[styles.nearMeView, { 
            backgroundColor: selectedCity != 'current' ? colors.white : colors.borderGrayColor
         }]}>
          <Image
            source={ImageConstants.location}
            style={styles.locationIconStyle}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.nearMeTxtStyle,
              {
                fontSize: nearByType?.location_title?.length > 9 ? 10 : 14,
              },
            ]}>
            {nearByType?.location_title}{' '}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onTempaClick} style={[styles.nearMeView, {
          backgroundColor: selectedCity == 'current' ? colors.white : colors.borderGrayColor
        }]}>
          <Image
            source={ImageConstants.location}
            style={styles.locationIconStyle}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.nearMeTxtStyle,
              {
                fontSize:  14,
              },
            ]}>
            {currentCity}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          onPress={onSearchClick}
          style={styles.rightIconContainer}>
          <Image
            source={ImageConstants.searchInput}
            style={styles.rightIconStyle}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={notificationClick}
          style={styles.rightIconContainer}>
          {notificationCount > 0 && (
            <View style={styles.notificationParentContainer}>
              <View style={styles.notificationChildView} />
            </View>
          )}

          <Image
            source={ImageConstants.bell}
            style={[styles.rightIconStyle, { tintColor: colors.lightBlack }]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ReelHeader;

