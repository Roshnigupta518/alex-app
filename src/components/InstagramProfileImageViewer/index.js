// import React from 'react';
// import {
//   Modal,
//   Pressable,
//   Image,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';

// const { width } = Dimensions.get('window');

// const FullscreenImageModal = ({ visible, imageSource, onClose }) => {
//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <Pressable style={styles.overlay} onPress={onClose}>
//         <Image
//           source={imageSource}
//           style={styles.fullscreenImage}
//           resizeMode="contain"
//         />
//       </Pressable>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullscreenImage: {
//     width: width,
//     height: width,
//   },
// });

// export default FullscreenImageModal;


import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  BackHandler,
  Platform, Text
} from 'react-native';

const { width } = Dimensions.get('window');

const FullscreenImageModal = ({ visible, imageSource, onClose }) => {
  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      const backAction = () => {
        onClose(); // close the modal
        return true; // prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default FullscreenImageModal;
