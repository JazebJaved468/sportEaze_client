export type RegisterPlayerParams = {
  profilePicUrl: string;
  fullName: string;
  username: string;
  dob: string;
  gender: number;
  primarySport: number;
  secondarySports: number[];
  playingLevel: number;
  currentTeam?: string;
  coachName?: string;
  playerBio?: string;
  trainingLocation?: string;
  availableForSponsorship: boolean;
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
};

export type FollowPlayerParams = {
  playerId: string;
};

export type CreateTextPostParams = {
  textContent: string;
  visibility: number;
};
export type CreateMediaPostParams = {
  textContent: string;
  visibility: number;
  media: MediaParam[];
};

export type MediaParam = {
  mediaType: number;
  mediaOrder: number;
  mediaLink: string;
};

export type CreateCommentOnPostParams = {
  content: string;
  parentCommentId: string | null;
  postId: string;
};

export type CreateLikeOnPostParams = {
  unLike: boolean;
  postId: string;
};

export type SharePostParams = {
  shareMessage: string;
  originalPostId: string;
};
