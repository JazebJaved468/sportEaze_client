import {useColorMode} from 'native-base';
import {useEffect, useRef, useState} from 'react';
import {appColors} from '../../constants/colors';

/**
 * useDidUpdateEffect - Runs an effect only after the first render.
 * @param effect - The effect function to run.
 * @param deps - Dependency array for useEffect.
 */

export const useDidUpdateEffect = (
  effect: () => void | (() => void),
  deps: any[],
) => {
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps);
};

export const useContainerShadow = (
  elevation: number = 3,
  shadowColor: string = 'rgba(35, 36, 35, 0.4)',
) => {
  const {colorMode} = useColorMode();

  if (colorMode === 'light') {
    return {
      shadowColor: shadowColor,
      // shadowColor: appColors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: elevation,
    };
  } else {
    return {};
  }
};
