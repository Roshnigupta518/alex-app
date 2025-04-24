import AsyncStorage from "@react-native-async-storage/async-storage";

const Storage = {
  store: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('AsyncStorage set error: ', e);
    }
  },

  get: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log('AsyncStorage get error: ', e);
      return null;
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('AsyncStorage clearAll error: ', e);
    }
  }
};

export default Storage;