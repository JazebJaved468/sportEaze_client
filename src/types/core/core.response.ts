import {Connection} from '../auth/auth.type';

export type AvailableSportsResponse = Record<string, string>;

export type ConnectUserResponse = {
  connection: Connection;
  message: string;
  success: boolean;
};
