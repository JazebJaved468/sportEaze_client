import {User} from '../auth/auth.type';
import {Player, Post} from './player.type';

export type GetPlayerResponse = {
  player: Player;
  success: boolean;
};

export type registerPlayerResponse = {
  user: User;
  success: boolean;
  message: string;
};
export type FollowPlayerResponse = {
  success: boolean;
  message: string;
};

export type CreateTextPostResponse = {
  success: boolean;
  post: Post;
};
