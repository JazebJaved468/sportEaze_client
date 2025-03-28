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

export type Post = {
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
