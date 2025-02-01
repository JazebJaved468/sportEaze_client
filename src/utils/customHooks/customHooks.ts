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
