import {USER_TYPE} from '../../constants/enums';
import {authApi} from '../../store/auth/auth.service';
import {
  removeUser,
  updateIsLoggedIn,
  updateUser,
  updateUserToken,
  updateUserType,
} from '../../store/auth/auth.slice';
import {playerApi} from '../../store/player/player.service';
import {store} from '../../store/store';
import {User} from '../../types/auth/auth.type';
import {
  multiRemoveFromLocalStorage,
  multiStoreInLocalStorage,
  storeInLocalStorage,
} from './asyncStorage';

export const onLogout = async () => {
  const dispatch = store.dispatch;

  dispatch(updateIsLoggedIn(false));
  dispatch(updateUserToken(''));
  dispatch(updateUserType(USER_TYPE.GENERAL));
  dispatch(removeUser());

  await multiRemoveFromLocalStorage({
    keys: ['userToken', 'userType'],
  });
};

export const onRegisterUser = async (args: {
  userType: number;
  userToken: string;
}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserToken(args.userToken));
  dispatch(updateIsLoggedIn(true));

  multiStoreInLocalStorage({
    keyValuePairs: [
      ['userToken', args.userToken],
      ['userType', args.userType.toString()],
    ],
  });
};

export const onLogin = async (args: {user: User; userToken: string}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserToken(args.userToken));
  // await dispatch(
  //   authApi.endpoints.getUserSettings.initiate(undefined, {forceRefetch: true}),
  // );

  dispatch(updateUserType(args.user.userType || USER_TYPE.GENERAL));
  dispatch(updateIsLoggedIn(true));
  dispatch(updateUser(args.user));

  await multiStoreInLocalStorage({
    keyValuePairs: [
      ['userToken', args.userToken],
      [
        'userType',
        args.user.userType
          ? args.user.userType.toString()
          : USER_TYPE.FAN.toString(),
      ],
    ],
  });
};

export const updateUserTypeOnRegister = async (args: {
  userType: number | null;
}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserType(args.userType || USER_TYPE.FAN));

  multiStoreInLocalStorage({
    keyValuePairs: [
      [
        'userType',
        args.userType ? args.userType.toString() : USER_TYPE.FAN.toString(),
      ],
    ],
  });
};
