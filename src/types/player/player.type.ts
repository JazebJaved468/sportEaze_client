import {User} from '../auth/auth.type';

export type Player = {
  id: string;
  primarySport: number;
  secondarySports: number[] | null;
  playingLevel: number;
  currentTeam: string | null;
  coachName: string | null;
  playerBio: string;
  trainingLocation: string | null;
  fbLink: string | null;
  instaLink: string | null;
  xLink: string | null;
  availableForSponsorship: boolean;
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
  id: string;
  userId: string;
  textContent: string;
  visibility: number;
  shareCount: number;
  postType: number;
  createdAt: string;
  updatedAt: string;
  media: Media[];
  likes: any[];
  user: User;
  comments: any[];
  likeCount: number;
  // reactions:    Reactions;
  commentCount: number;
};
