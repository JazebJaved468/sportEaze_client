import {User} from '../auth/auth.type';

export type VerifyPatronResponse = {
  message: string;
  user: User;
};
