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
