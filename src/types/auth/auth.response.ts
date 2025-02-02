import {User} from './auth.type';

export type RegisterFanResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  UserType: string;
};

export type LoginUserResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  userType: string;
};

export type GetUserSettingsResponse = {
  success: boolean;
  user: User;
};

export type onBecomingPlayerResponse = {
  message: string;
  player: User;
  success: boolean;
};

export type UpdateUserResponse = {
  message: string;
  user: User;
  success: boolean;
};
