export type RegisterUserParams = {
  email: string;
  password: string;
};

export type LoginParams = {
  email: string;
  password: string;
  recover?: boolean;
};

export type UpdateFanParams = {
  fullName?: string;
  gender?: number;
  dob?: string;
  profilePicUrl?: string | null;
  sportInterests?: number[];
  password?: string;
};
export type UpdatePatronParams = {
  fullName?: string;
  profilePicUrl?: string | null;
  dob?: string;
  gender?: number;
  patronType?: number;
  industryType?: string;
  supportedSports?: number[];
  preferredPlayerLevels?: number[];
  preferredFundingTypes?: number[];
  website?: string;
  linkedIn?: string;
  fbLink?: string;
  xLink?: string;
  instaLink?: string;
  walletTotal?: number;
  walletPending?: number;
};
