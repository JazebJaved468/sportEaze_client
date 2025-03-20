export type RegisterUserParams = {
  email: string;
  password: string;
};

export type LoginParams = {
  email: string;
  password: string;
  recover?: boolean;
};

export type UpdateUserParams = {
  name?: string;
  gender?: number;
  dob?: string;
  city?: string;
  country?: string;
  profilePicUrl?: string | null;
  username?: string;
};
