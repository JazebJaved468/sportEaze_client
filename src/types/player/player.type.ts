import {User} from '../auth/auth.type';
import {UserWindow} from '../core/core.type';

export type Player = {
  availableForSponsorship: boolean;
  coachName: string | null;
  commentsCount: number;
  countSharedPosts: number;
  currentTeam: string | null;
  endorsementsReceived: number;
  fbLink: string | null;
  followerCount: number;
  id: string;
  instaLink: string | null;
  pendingConnectionCount: number;
  playerBio: string;
  playingLevel: number;
  primarySport: number;
  secondarySports: number[] | null;
  trainingLocation: string | null;
  userPostLikesCount: number;
  wallet: Wallet;
  xLink: string | null;
  postCount: number;
  totalContracts: number;
};

export type Wallet = {
  cash: number;
  id: string;
  payables: number;
};

export type CreatePost = {
  userId: string;
  textContent: string;
  visibility: number;
  postType: number;
  id: string;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  media?: Media[];
};

export type Media = {
  mediaType: number;
  mediaLink: string;
  mediaOrder: number;
  postId: string;
  mediaThumbnail: string | null;
  id: string;
};
export type Post = {
  isLiked?: boolean;
  id: string;
  textContent: string;
  visibility: number;
  shareCount: number;
  postType: number;
  createdAt: string;
  updatedAt: string;
  media: Media[];
  user: UserWindow;
  likeCount: number;
  commentCount: number;
  sharedId?: string;
  share?: Share;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: UserWindow;
};

export type CreateComment = {
  userId: string;
  postId: string;
  content: string;
  parentComment: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type SharedPost = {
  shareMessage: string;
  visibility: number;
  originalPost: Post;
};

export type Share = {
  message: string;
  user: UserWindow;
};
