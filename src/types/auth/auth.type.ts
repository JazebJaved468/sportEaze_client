export type User = {
  createdAt: string;
  deleted: boolean;
  dob: string;
  email: string;
  gender: number;
  id: string;
  profilePicUrl: string | null;
  updatedAt: string;
  userType: number;
  username: string;
  fullName: string;
  sportInterests: number[];
};
