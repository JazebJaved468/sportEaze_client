import AsyncStorage from '@react-native-async-storage/async-storage';

type KeysInLocalStorage = 'colorMode';

export const storeInLocalStorage = async ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  try {
    const res = await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(
      `x-x-x-x-x-x-x-x-x-x-x-x-x--> error saving ${key} in local storage`,
      error,
    );
  }
};

export const getFromLocalStorage = async ({key}: {key: KeysInLocalStorage}) => {
  try {
    const res = await AsyncStorage.getItem(key);
    console.log('---------------> color mode', res);
  } catch (error) {
    console.log(
      `x-x-x-x-x-x-x-x-x-x-x-x-x--> error getting ${key} from local storage`,
      error,
    );
  }
};
