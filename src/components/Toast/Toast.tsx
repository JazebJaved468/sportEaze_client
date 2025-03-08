import {useColorModeValue} from 'native-base';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  useAppDispatch,
  useAppSelector,
} from '../../utils/customHooks/storeHooks';
import {appColors} from '../../constants/colors';
import {updateToast} from '../../store/core/core.slice';

export const Toast = () => {
  const screenWidth = Dimensions.get('screen').width;
  const dispatch = useAppDispatch();
  const {toast} = useAppSelector(state => state.core);

  const translateY = useRef(new Animated.Value(-120)).current;

  const textColor = useColorModeValue(appColors.white, appColors.black);
  const toastColor = useColorModeValue(appColors.black, appColors.white);

  useEffect(() => {
    if (toast.isVisible && toast.message) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          hideToast();
        }, 4000);
      });
    }
  }, [toast.isVisible, toast.message]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(
        updateToast({
          isVisible: false,
          message: '',
        }),
      );
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: toastColor,
          width: screenWidth - 32,
          transform: [{translateY}],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={hideToast}
        style={styles.modalText}>
        <Text
          style={{
            color: textColor,
            textAlign: 'center',
          }}>
          {toast.message ?? ''}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 1,
    zIndex: 1,
  },
  modalText: {
    alignItems: 'center',
    padding: 12,
    width: '100%',
    zIndex: 1,
  },
});
