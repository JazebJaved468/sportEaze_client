export type Mentor = {
  id: string;
  fbLink: string | null;
  instaLink: string | null;
  xLink: string | null;
  role: number;
  sportInterests: number[];
  yearsOfExperience: string;
  currentAffiliation: string;
  website: string | null;
  linkedIn: string | null;
  verificationDocuments: string[] | null;
  bio: string;
  primarySport: number;
};
