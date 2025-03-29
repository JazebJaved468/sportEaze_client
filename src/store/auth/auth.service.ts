import {sporteazeBaseApi} from '../baseApi.service';
import {
  LoginParams,
  RegisterUserParams,
  UpdateUserParams,
} from '../../types/auth/auth.params';
import {
  GetUserSettingsResponse,
  LoginUserResponse,
  RegisterUserResponse,
  UpdateUserResponse,
} from '../../types/auth/auth.response';
import {User} from '../../types/auth/auth.type';
import {updateUser} from './auth.slice';
import {onLogin, onRegisterUser} from '../../utils/helpers/auth';
import {USER_TYPE} from '../../constants/enums';

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
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLazyGetUserSettingsQuery,
  useGetUserSettingsQuery,
  useUpdateUserMutation,
  useGetUserByIdServiceQuery,
} = authApi;
