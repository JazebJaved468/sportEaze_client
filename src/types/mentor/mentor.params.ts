export type RegisterMentorParams = {
  profilePicUrl: string;
  fullName: string;
  username: string;
  dob: string;
  gender: number;
  role: number;
  sportInterests: number[];
  yearsOfExperience: string;
  currentAffiliation?: string;
  website?: string;
  linkedIn?: string;
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
  bio?: string;
  primarySport?: number;
};
