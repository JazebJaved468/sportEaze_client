export type RegisterFanParams = {
  email: string;
  password: string;
  recover?: boolean;
};

export type LoginParams = {
  email: string;
  password: string;
  recover?: boolean;
};

export type UpdateUserParams = {
  name?: string;
  gender?: string;
  dob?: string;
  city?: string;
  country?: string;
  profilePicUrl?: string | null;
};
