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
