import {AvailableSportsResponse} from '../../types/core/core.response';
import {UserWindow} from '../../types/core/core.type';
import {sporteazeBaseApi} from '../baseApi.service';

export const coreApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    getAvailableSports: builder.query<AvailableSportsResponse, void>({
      query: () => ({
        url: `/sport`,
      }),
      transformResponse: (response: AvailableSportsResponse) => {
        return response;
      },
    }),

    getSearchedUsers: builder.query<UserWindow[], string>({
      query: body => ({
        url: `/user/search/${body}`,
      }),
      transformResponse: (response: UserWindow[]) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetAvailableSportsQuery,
  useLazyGetAvailableSportsQuery,
  useLazyGetSearchedUsersQuery,
} = coreApi;
