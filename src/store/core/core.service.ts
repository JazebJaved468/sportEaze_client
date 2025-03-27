import {AvailableSportsResponse} from '../../types/core/core.response';
import {SearchedUser} from '../../types/core/core.type';
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

    getSearchedUsers: builder.query<SearchedUser[], string>({
      query: body => ({
        url: `/user/search/${body}`,
      }),
      transformResponse: (response: SearchedUser[]) => {
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
