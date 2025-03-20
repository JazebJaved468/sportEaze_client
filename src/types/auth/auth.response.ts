import {User} from './auth.type';

export type RegisterUserResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  userType: number;
};

export type LoginUserResponse = {
  message: string;
  success: boolean;
  accessToken: string;
  userType: number;
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
