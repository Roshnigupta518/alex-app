import React from 'react';
import {
  Modal,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const FullscreenImageModal = ({ visible, imageSource, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Image
          source={imageSource}
          style={styles.fullscreenImage}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: width,
  },
});

export default FullscreenImageModal;
