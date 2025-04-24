import React from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {colors, fonts, HEIGHT, wp} from '../constants';
import LottieView from 'lottie-react-native';
import animation from '../constants/AnimationConstants';

const NoInternetModal = ({shouldShow = false}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={false}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LottieView
            source={animation.noInternet}
            style={{
              height: HEIGHT / 4,
              width: HEIGHT / 4,
            }}
            autoPlay
            loop
          />

          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: wp(18),
              color: colors.red,
            }}>
            No Internet Connection!
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: wp(10),
              color: colors.gray,
              textAlign: 'center',
            }}>
            Please check your connection and try again.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default NoInternetModal;
