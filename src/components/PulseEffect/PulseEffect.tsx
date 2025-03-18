import React, {PropsWithChildren} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type PulsePropsType = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  scaleValue?: number;
}>;

export const PulseEffect: React.FC<PulsePropsType> = ({
  children,
  onPress,
  disabled,
  scaleValue = 0.97,
}) => {
  const isActive = useSharedValue<boolean>(false);

  const gesture = Gesture.Tap()
    .maxDuration(10000)
    .onTouchesDown(() => {
      isActive.value = true;
    })
    .onTouchesUp(() => {
      if (onPress && isActive.value && !disabled) runOnJS(onPress)();
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  const animateTouchable = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(isActive.value ? scaleValue : 1, {duration: 100}),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animateTouchable}>{children}</Animated.View>
    </GestureDetector>
  );
};
