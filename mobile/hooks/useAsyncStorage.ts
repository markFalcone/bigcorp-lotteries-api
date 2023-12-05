// eslint-disable-next-line import/no-extraneous-dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@selectedLotteries';

const useAsyncStorage = () => {
  const [storedData, setStoredData] = useState<string[]>();
  const storeData = async (newSelectedIds: string[]) => {
    try {
      const existedJson = await AsyncStorage.getItem(STORAGE_KEY);
      let existedData = existedJson != null ? JSON.parse(existedJson) : [];
      existedData.push(...newSelectedIds);
      const updatedJsonValue = JSON.stringify(existedData);
      await AsyncStorage.setItem(STORAGE_KEY, updatedJsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const getStoredData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedJson = jsonValue !== null ? JSON.parse(jsonValue) : null;
      setStoredData(parsedJson);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getStoredData();
  }, []);

  return {
    storedData,
    storeData,
    getStoredData,
  };
};

export default useAsyncStorage;
