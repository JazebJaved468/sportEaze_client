import {User} from '../auth/auth.type';
import {UserWindow} from '../core/core.type';

export type Patron = {
  id: string;
  patronType: number;
  industryType: string;
  supportedSports: number[];
  preferredPlayerLevels: number[];
  preferredFundingTypes: number[];
  website: string | null;
  linkedIn: string | null;
  fbLink: string | null;
  xLink?: string | null;
  instaLink: string | null;
  status: number;
  reviewedByAdminId: string;
  adminReviewComment: string;
};

export type Contract = {
  id: string;
  description: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  patron: UserWindow;
  player: UserWindow;
  milestones: ContractMilestone[];
  status: number;
};

export type ContractMilestone = {
  id: string;
  description: string;
  amount: string;
  isAchieved: boolean;
  contractId: string;
};
