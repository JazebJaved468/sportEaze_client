import {DropDownItemType} from '../components/CustomDropDown/CustomDropDown';
import {PlayingLevel} from './enums';

export const playingLevels: DropDownItemType[] = [
  {
    id: 1,
    title: 'Beginner',
    value: PlayingLevel.BEGINNER,
  },
  {
    id: 2,
    title: 'Amateur',
    value: PlayingLevel.AMATEUR,
  },
  {
    id: 3,
    title: 'Professional',
    value: PlayingLevel.PROFESSIONAL,
  },
];
