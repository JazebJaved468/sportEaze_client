import {authApi} from '../../store/auth/auth.service';
import {
  removeUser,
  updateIsLoggedIn,
  updateUserToken,
  updateUserType,
} from '../../store/auth/auth.slice';
import {playerApi} from '../../store/player/player.service';
import {store} from '../../store/store';
import {USER_TYPE} from '../../types/user/user';
import {
  multiRemoveFromLocalStorage,
  multiStoreInLocalStorage,
  storeInLocalStorage,
} from './asyncStorage';

export const onLogout = async () => {
  const dispatch = store.dispatch;

  dispatch(updateIsLoggedIn(false));
  dispatch(updateUserToken(''));
  dispatch(updateUserType(USER_TYPE.FAN));
  dispatch(removeUser());

  await multiRemoveFromLocalStorage({
    keys: ['userToken', 'userType'],
  });
};

export const onRegisterAsFan = async (args: {
  userType: number;
  userToken: string;
}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserToken(args.userToken));
  dispatch(updateUserType(args.userType));
  dispatch(updateIsLoggedIn(true));

  await dispatch(
    authApi.endpoints.getUserSettings.initiate(undefined, {forceRefetch: true}),
  );

  await multiStoreInLocalStorage({
    keyValuePairs: [
      ['userToken', args.userToken],
      ['userType', args.userType.toString()],
    ],
  });
};

export const onLogin = async (args: {userType: number; userToken: string}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserToken(args.userToken));
  dispatch(updateUserType(args.userType));
  dispatch(updateIsLoggedIn(true));

  await dispatch(
    authApi.endpoints.getUserSettings.initiate(undefined, {forceRefetch: true}),
  );

  await multiStoreInLocalStorage({
    keyValuePairs: [
      ['userToken', args.userToken],
      ['userType', args.userType.toString()],
    ],
  });
};

export const onBecomingPlayer = async (args: {userType: number}) => {
  const dispatch = store.dispatch;
  dispatch(updateUserType(args.userType));
  const res = await dispatch(
    playerApi.endpoints.getPlayerSettings.initiate(undefined, {
      forceRefetch: true,
    }),
  );

  await storeInLocalStorage({
    key: 'userType',
    value: args.userType.toString(),
  });
};
