import {useColorMode} from 'native-base';
import {useEffect, useRef, useState} from 'react';

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

export const useContainerShadow = () => {
  const {colorMode} = useColorMode();

  if (colorMode === 'light') {
    return {
      shadowColor: 'rgba(35, 36, 35, 0.4)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 6,
    };
  } else {
    return {};
  }
};
