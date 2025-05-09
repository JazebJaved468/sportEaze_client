import {AppSettings} from '../../types/superAdmin/superAdmin.type';
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

    getPatronRequests: builder.query<any[], void>({
      query: () => ({
        url: `/user/patron/registrations`,
      }),
    }),
  }),
});

export const {
  useGetPatronRequestsQuery,
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useLazyGetAppSettingsQuery,
} = superAdminApi;
