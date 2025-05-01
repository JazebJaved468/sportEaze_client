import {User} from '../auth/auth.type';

export type registerPatronResponse = {
  user: User;
  success: boolean;
  message: string;
};
