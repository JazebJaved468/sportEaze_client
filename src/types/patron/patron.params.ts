export type RegisterPatronParams = {
  profilePicUrl: string;
  fullName: string;
  username: string;
  patronType: number;
  industryType: string;
  supportedSports: number[];
  preferredPlayerLevels: number[];
  preferredFundingTypes: number[];
  fbLink?: string;
  instaLink?: string;
  xLink?: string;
  website: string;
  linkedIn: string;
};
