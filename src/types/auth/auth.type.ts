import {Player} from '../player/player.type';

export type User = {
  createdAt: string;
  deleted: boolean;
  dob: string;
  email: string;
  gender: number;
  id: string;
  profilePicUrl: string | null;
  updatedAt: string;
  userType: number | null;
  username: string;
  fullName: string;
  sportInterests: number[] | null;
  isConnected?: boolean;
  isFollowing?: boolean;
  player?: Player;
};
