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

export type GetPostsByPlayerIdResponse = Post[];
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
  message: string;
  sharedPost: SharedPost;
};

export type GetMyFollowersResponse = {
  followers: UserWindow[];
  count: number;
  success: boolean;
};

export type PlayerComparisonResponse = {
  playerOne: {
    id: string;
    email: string;
    profilePicUrl: string;
    fullName: string;
    username: string;
    dob: string;
    gender: number;
    sportInterests: null | number[];
    userType: number;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    player: {
      id: string;
      primarySport: number;
      secondarySports: number[] | null;
      playingLevel: number;
      currentTeam: string | null;
      coachName: string | null;
      playerBio: string | null;
      trainingLocation: string | null;
      fbLink: string | null;
      instaLink: string | null;
      xLink: string | null;
      availableForSponsorship: boolean;
      wallet: {
        id: string;
        cash: number;
        payables: number;
      };
      followerCount: number;
      connectionCount: number;
      pendingConnectionCount: number;
      endorsementsReceived: number;
      countSharedPosts: number;
      commentsCount: number;
      userPostLikesCount: number;
      postCount: number;
    };
    connection: {
      status: number;
    };
    sharedPostCount: number;
    connectionCount: number;
    followerCount: number;
  };
  playerTwo: {
    id: string;
    email: string;
    profilePicUrl: string;
    fullName: string;
    username: string;
    dob: string;
    gender: number;
    sportInterests: null | number[];
    userType: number;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    player: {
      id: string;
      primarySport: number;
      secondarySports: number[] | null;
      playingLevel: number;
      currentTeam: string | null;
      coachName: string | null;
      playerBio: string | null;
      trainingLocation: string | null;
      fbLink: string | null;
      instaLink: string | null;
      xLink: string | null;
      availableForSponsorship: boolean;
      wallet: {
        id: string;
        cash: number;
        payables: number;
      };
      followerCount: number;
      connectionCount: number;
      pendingConnectionCount: number;
      endorsementsReceived: number;
      countSharedPosts: number;
      commentsCount: number;
      userPostLikesCount: number;
      postCount: number;
    };
    connection: {
      status: number;
    };
    sharedPostCount: number;
    connectionCount: number;
    followerCount: number;
  };
  success: boolean;
  message: string;
};
