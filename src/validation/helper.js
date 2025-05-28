import { Linking } from "react-native";
export const formatCount = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num?.toString();
    }
  };

  export  const openSocialLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      console.log('canOpenURL:', supported);
      await Linking.openURL(url);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };


  export const tabList = [
    { key: 'photo', title: 'Photos' },
    { key: 'video', title: 'Videos' },
  ];
  


  