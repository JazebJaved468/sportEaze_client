import {sporteazeBaseApi} from '../baseApi.service';
import {
  LoginParams,
  RegisterUserParams,
  UpdateFanParams,
  UpdatePatronParams,
} from '../../types/auth/auth.params';
import {
  GetUserSettingsResponse,
  LoginUserResponse,
  RegisterUserResponse,
} from '../../types/auth/auth.response';
import {User} from '../../types/auth/auth.type';
import {updateUser} from './auth.slice';
import {onLogin, onLogout, onRegisterUser} from '../../utils/helpers/auth';
import {USER_TYPE} from '../../constants/enums';
import {coreApi} from '../core/core.service';

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
            userType: USER_TYPE.GENERAL,
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

    updateFan: builder.mutation<User, UpdateFanParams>({
      query: body => ({
        url: `/user/fan`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(updateUser(data));
        } catch (error) {
          console.log(
            'Error while Updating user data : auth.service.ts : Line 60',
            error,
          );
        }
      },
    }),

    //

    updatePatron: builder.mutation<{user: User}, UpdatePatronParams>({
      query: body => ({
        url: `/user/patron`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(updateUser(data.user));
        } catch (error) {
          console.log(
            'Error while Updating patron data : auth.service.ts : Line 60',
            error,
          );
        }
      },
    }),

    //

    loginUser: builder.mutation<LoginUserResponse, LoginParams>({
      query: body => ({
        url: `/user/login`,
        method: 'POST',
        body: {
          ...body,
          recover: true,
        },
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          await onLogin({
            user: data.user,
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
          dispatch(
            coreApi.endpoints.getNotifications.initiate(
              {userId: data.id},
              {forceRefetch: true},
            ),
          );
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while getting user settings : auth.service.ts : Line 65',
            err,
          );
        }
      },
    }),

    getUserByIdService: builder.query<User, {userId: string}>({
      query: ({userId}) => ({
        url: `/user/${userId}`,
      }),
      transformResponse: (response: User) => {
        return response;
      },
    }),

    deleteUser: builder.mutation<{}, void>({
      query: body => ({
        url: `/user`,
        method: 'DELETE',
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          await onLogout();
        } catch (err) {
          console.log(
            'Error while deleting user : auth.service.ts : Line 138',
            err,
          );
        }
      },
    }),
  }),
});

export const {
  useUpdatePatronMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLazyGetUserSettingsQuery,
  useGetUserSettingsQuery,
  useUpdateFanMutation,
  useGetUserByIdServiceQuery,
  useDeleteUserMutation,
} = authApi;
