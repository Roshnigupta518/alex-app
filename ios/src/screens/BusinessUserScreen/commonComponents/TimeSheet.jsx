import React, {forwardRef, useRef, useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {colors, fonts, WIDTH, wp} from '../../../constants';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImageConstants from '../../../constants/ImageConstants';
import CustomButton from '../../../components/CustomButton';

const TimeSheet = forwardRef(({onSuccess = () => {}}, ref) => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  var tempDate = new Date();
  tempDate.setFullYear(tempDate.getFullYear() - 18);

  const actionSheetRef = useRef(null);
  // Expose actionSheetRef to parent component through forwarded ref
  React.useImperativeHandle(ref, () => ({
    show: () => {
      actionSheetRef.current?.show();
    },
    hide: () => {
      actionSheetRef.current?.hide(false);
    },
  }));

  return (
    <ActionSheet ref={actionSheetRef} containerStyle={styles.container}>
      <View style={styles.subView}>
        <View style={styles.drawerHandleStyle} />

        <View style={styles.commentCountView}>
          {/* <Text style={styles.commentCountTxt}>Comments</Text> */}
        </View>

        <View style={styles.commentListContainer}>
          <View
            style={{
              marginTop: 0,
              margin: wp(20),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={ImageConstants.timer}
              style={{
                // transform: [{rotate: '180deg'}],
                height: wp(30),
                width: wp(30),
                tintColor: colors.primaryColor,
              }}
            />
            <View
              style={{
                marginLeft: 10,
              }}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: wp(20),
                  color: colors.black,
                }}>
                Select Time
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.white,
            }}
          />
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.white,
            }}>
            <DatePicker
              date={date}
              mode="time"
              theme={'light'}
              onDateChange={res => {
                setSelectedTime(res);
              }}
            />
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.black,
            }}
          />

          <View
            style={{
              marginVertical: wp(20),
            }}>
            <CustomButton
              label="Submit"
              onPress={() => {
                if (selectedTime != null) {
                  onSuccess(moment(selectedTime).format('hh:mm a'));
                }
                actionSheetRef.current?.hide();
              }}
            />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },
  subView: {
    backgroundColor: colors.white,
    paddingTop: wp(20),
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
  },

  drawerHandleStyle: {
    height: wp(7),
    width: wp(60),
    backgroundColor: colors.lightBlack,
    borderRadius: 40,
    alignSelf: 'center',
  },

  commentCountView: {
    marginTop: wp(10),
    margin: wp(20),
  },

  commentCountTxt: {
    fontFamily: fonts.semiBold,
    fontSize: wp(17),
    color: colors.white,
    textAlign: 'center',
  },

  commentListContainer: {
    // height: HEIGHT / 2.7,
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginBottom: wp(30),
  },

  userImageStyle: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(10),
    // alignItems: 'center',
    minHeight: wp(87),
    marginVertical: 5,
    width: WIDTH,
  },

  userImageView: {
    height: wp(60),
    width: wp(60),
    borderRadius: 50,
  },

  userCotentContainer: {
    width: WIDTH / 1.8,
    marginHorizontal: 10,
  },

  usernameStyle: {
    fontFamily: fonts.bold,
    fontSize: wp(16),
    color: colors.primaryColor,
  },

  userCommentStyle: {
    fontFamily: fonts.regular,
    fontSize: wp(14),
    color: colors.white,
  },

  drawerStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    height: wp(80),
    // width: WIDTH / 3,
    marginTop: 10,
    backgroundColor: colors.primaryColor,
  },

  deleteIconView: {
    height: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
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

  timeStyle: {
    fontFamily: fonts.medium,
    color: colors.gray,
    fontSize: wp(10),
    width: WIDTH / 6,
    textAlign: 'right',
  },

  imageStyle: {
    height: wp(60),
    width: wp(60),
    alignSelf: 'center',
    marginVertical: wp(30),
  },
});
export default TimeSheet;
