import {Mentor} from '../mentor/mentor.type';
import {Patron} from '../patron/patron.type';
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
  connection: Connection;
  isFollowing?: boolean;
  player?: Player;
  mentor?: Mentor;
  patron?: Patron;
};

export type Connection = {
  id?: string;
  status: number;
  receiverId?: string;
};
