import {User} from '../auth/auth.type';
import {UserWindow} from '../core/core.type';
import {
  Player,
  CreatePost,
  Post,
  Comment,
  CreateComment,
  SharedPost,
} from './player.type';

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
  post: CreatePost;
};

export type GetPostsByPlayerIdResponse = {
  posts: Post[];
  success: boolean;
};

export type GetPostIdResponse = {
  post: Post;
  success: boolean;
};

export type CommmentsByPostIdResponse = {
  commentCount: number;
  currentPage: number;
  totalPages: number;
  comments: Comment[];
};
export type LikesByPostIdResponse = {
  success: boolean;
  likeCount: number;
  users: UserWindow[];
};

export type CreateCommentOnPostResponse = {
  success: boolean;
  message: string;
  comment: CreateComment;
};

export type CreateLikeOnPostResponse = {
  success: boolean;
  liked: boolean;
  likeCount: number;
};
export type SharePostResponse = {
  success: boolean;
  sharedPost: SharedPost;
};

export type GetMyFollowersResponse = {
  followers: UserWindow[];
  count: number;
  success: boolean;
};
