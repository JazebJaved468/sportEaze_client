import AsyncStorage from '@react-native-async-storage/async-storage';

type KeysInLocalStorage =
  | 'colorMode'
  | 'isFirstVisit'
  | 'userToken'
  | 'userType';

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

export const multiStoreInLocalStorage = async ({
  keyValuePairs,
}: {
  keyValuePairs: ReadonlyArray<readonly [string, string]>;
}) => {
  try {
    const res = await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.log(
      `x-x-x-x-x-x-x-x-x-x-x-x-x--> error saving ${keyValuePairs} in local storage`,
      error,
    );
  }
};

export const getFromLocalStorage = async ({key}: {key: KeysInLocalStorage}) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res;
  } catch (error) {
    console.log(
      `x-x-x-x-x-x-x-x-x-x-x-x-x--> error getting ${key} from local storage`,
      error,
    );
  }
};

export const multiRemoveFromLocalStorage = async ({
  keys,
}: {
  keys: KeysInLocalStorage[];
}) => {
  try {
    const res = await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.log(
      `x-x-x-x-x-x-x-x-x-x-x-x-x--> error removing ${keys} from local storage`,
      error,
    );
  }
};
