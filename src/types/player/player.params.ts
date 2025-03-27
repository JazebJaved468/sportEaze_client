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
