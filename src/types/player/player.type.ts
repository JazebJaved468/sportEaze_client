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
