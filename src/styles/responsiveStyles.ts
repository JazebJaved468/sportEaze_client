import {Dimensions} from 'react-native';

export const BENCHMARK_HEIGHT: number = 844;
export const BENCHMARK_WIDTH: number = 390;

export const deviceHeight = Dimensions.get('screen').height;
export const deviceWidth = Dimensions.get('screen').width;

export const customWidth = (width: number) => {
  const ratio = width / BENCHMARK_WIDTH;
  return deviceWidth * ratio;
};

export const customHeight = (height: number) => {
  const ratio = height / BENCHMARK_HEIGHT;
  return deviceHeight * ratio;
};
