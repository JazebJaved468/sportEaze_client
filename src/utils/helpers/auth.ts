import {USER_TYPE} from '../../constants/enums';
import {authApi} from '../../store/auth/auth.service';
import {
  removeUser,
  updateIsLoggedIn,
  updateUserToken,
  updateUserType,
} from '../../store/auth/auth.slice';
import {playerApi} from '../../store/player/player.service';
import {store} from '../../store/store';
import {
  multiRemoveFromLocalStorage,
  multiStoreInLocalStorage,
  storeInLocalStorage,
} from './asyncStorage';

export const onLogout = async () => {
  const dispatch = store.dispatch;

  dispatch(updateIsLoggedIn(false));
  dispatch(updateUserToken(''));
  dispatch(updateUserType(0));
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
  dispatch(updateUserType(args.userType));
  dispatch(updateIsLoggedIn(true));

  await dispatch(
    authApi.endpoints.getUserSettings.initiate(undefined, {forceRefetch: true}),
  );

  multiStoreInLocalStorage({
    keyValuePairs: [
      ['userToken', args.userToken],
      ['userType', args.userType.toString()],
    ],
  });
};

export const onLogin = async (args: {userType: number; userToken: string}) => {
  const dispatch = store.dispatch;

  dispatch(updateUserToken(args.userToken));
  await dispatch(
    authApi.endpoints.getUserSettings.initiate(undefined, {forceRefetch: true}),
  );

  dispatch(updateUserType(args.userType));
  dispatch(updateIsLoggedIn(true));

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
