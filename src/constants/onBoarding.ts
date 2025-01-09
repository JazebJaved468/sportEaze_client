import {SvgProps} from 'react-native-svg';
import {PlayerModelIcon} from '../assets/icons';

export type OnBoardingDataType = {
  id: number;
  title: string;
  description: string;
  image: (props: SvgProps) => React.JSX.Element;
};

export const onBoardingData: OnBoardingDataType[] = [
  {
    id: 1,
    title: 'SportEaze',
    description:
      'Your one stop solution for all your sports entertainment needs',
    image: PlayerModelIcon,
  },
  {
    id: 2,
    title: 'Game On',
    description:
      'Dive into the energy and passion of the world’s most popular sport.',
    image: PlayerModelIcon,
  },
  {
    id: 3,
    title: 'Court Kings',
    description:
      'Explore the thrilling world of hoops and the stories of its icons.',
    image: PlayerModelIcon,
  },
  {
    id: 4,
    title: 'Race to Victory',
    description:
      'Feel the adrenaline of speed and precision in the world of racing.',
    image: PlayerModelIcon,
  },
];
