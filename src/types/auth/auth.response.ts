import {User} from './auth.type';

export type RegisterUserResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  userType: null;
};

export type LoginUserResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  user: User;
};

export type GetUserSettingsResponse = {
  success: boolean;
  user: User;
};

// export type UpdateUserResponse = {
//   message: string;
//   user: User;
//   success: boolean;
// };
