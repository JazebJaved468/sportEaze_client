import {User} from '../../types/auth/auth.type';
import {VerifyPatronParams} from '../../types/superAdmin/superAdmin.params';
import {VerifyPatronResponse} from '../../types/superAdmin/superAdmin.response';
import {AppSettings} from '../../types/superAdmin/superAdmin.type';
import {onPatronVerification} from '../../utils/helpers/superAdmin.utils';
import {sporteazeBaseApi} from '../baseApi.service';

export const superAdminApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    getAppSettings: builder.query<AppSettings, void>({
      query: () => ({
        url: `/app-settings`,
      }),
    }),

    updateAppSettings: builder.mutation<{}, AppSettings>({
      query: body => ({
        url: `/app-settings`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while upadting app setttings : superadmin.service.ts : Line 30',
            err,
          );
        }
      },
    }),

    getPatronRequests: builder.query<User[], void>({
      query: () => ({
        url: `/user/patron/registrations`,
      }),
    }),

    //
    verifyPatron: builder.mutation<VerifyPatronResponse, VerifyPatronParams>({
      query: ({patronId, ...body}) => ({
        url: `/user/patron/verify/${patronId}`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          console.log('response - chat read success', data);

          if (data.user.patron) {
            onPatronVerification(
              args.patronId,
              data.user.patron?.status,
              data.user.patron?.adminReviewComment,
            );
          }
          // onChatRead(args.chatId, args.user2Id);
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while verifying patron chat as read : core.service.ts : Line 274',
            err,
          );
        }
      },
    }),
  }),
});

export const {
  useVerifyPatronMutation,
  useGetPatronRequestsQuery,
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useLazyGetAppSettingsQuery,
} = superAdminApi;
