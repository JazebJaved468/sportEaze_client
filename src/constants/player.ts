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

export const playerLevels: Record<string, string> = {
  1: 'Beginner',
  2: 'Amateur',
  3: 'Professional',
};

/**
 * Converts an array of player level IDs to a comma-separated string of level names
 * @param levels Array of player level IDs
 * @returns Comma-separated string of player level names
 */
export const formatPlayerLevels = (
  levels: number[] | null | undefined,
): string => {
  if (!levels || !levels.length) {
    return 'None specified';
  }

  return levels
    .map(levelId => playerLevels[levelId] || `Unknown (${levelId})`)
    .join(', ');
};
