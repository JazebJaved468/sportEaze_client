import {sporteazeBaseApi} from '../baseApi.service';
import {
  LoginParams,
  RegisterUserParams,
  UpdateUserParams,
} from '../../types/auth/auth.params';
import {
  GetUserSettingsResponse,
  LoginUserResponse,
  onBecomingPlayerResponse,
  RegisterUserResponse,
  UpdateUserResponse,
} from '../../types/auth/auth.response';
import {User} from '../../types/auth/auth.type';
import {updateUser} from './auth.slice';
import {
  onBecomingPlayer,
  onLogin,
  onRegisterUser,
} from '../../utils/helpers/auth';

export const authApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserParams>({
      query: body => ({
        url: `/user/register`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          await onRegisterUser({
            userType: data.userType,
            userToken: data.accessToken,
          });
        } catch (err) {
          console.log(
            'Error while REgistering As a Fan : auth.service.ts : Line 31',
            err,
          );
        }
      },
    }),

    // replace it with reegister fan endpoint /user/fan
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserParams>({
      query: body => ({
        url: `/user/update-user`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(updateUser(data.user));
        } catch (err) {
          console.log(
            'Error while Updating user data : auth.service.ts : Line 66',
            err,
          );
        }
      },
    }),

    loginUser: builder.mutation<LoginUserResponse, LoginParams>({
      query: body => ({
        url: `/user/login`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          await onLogin({
            userType: data.userType,
            userToken: data.accessToken,
          });
        } catch (err) {
          console.log(
            'Error while logging in : auth.service.ts : Line 38',
            err,
          );
        }
      },
    }),

    getUserSettings: builder.query<User, void>({
      query: () => ({
        url: `/user`,
      }),
      transformResponse: (response: GetUserSettingsResponse) => {
        return response.user;
      },

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          dispatch(updateUser(data));
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while getting user settings : auth.service.ts : Line 65',
            err,
          );
        }
      },
    }),

    becomePlayer: builder.mutation<User, void>({
      query: id => ({
        url: '/user/player/become-player',
        method: 'POST',
      }),

      transformResponse: (response: onBecomingPlayerResponse) => {
        console.log('response - become player', response);
        return response.player;
      },
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          // dispatch(updateUser(data));
          await onBecomingPlayer({userType: data.userType});
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while updating fan as a player : player.service.ts : Line 22',
            err,
          );
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLazyGetUserSettingsQuery,
  useGetUserSettingsQuery,
  useBecomePlayerMutation,
  useUpdateUserMutation,
} = authApi;
