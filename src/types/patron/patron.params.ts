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

export type CreateContractParams = {
  playerId: string;
  description: string;
  totalAmount: number;
  endDate: string;
  status: number;
  milestones: MilestoneCreate[];
};

export type MilestoneCreate = {
  description: string;
  amount: number;
};

export type UpdateContractParams = {
  contractId: string;
} & CreateContractParams;

export type ReleaseFundsParams = {
  playerId: string;
  milestoneId: string;
};
