import {POST_FEED_PAGE_SIZE} from '../../constants/core';
import {AvailableSportsResponse} from '../../types/core/core.response';
import {UserWindow} from '../../types/core/core.type';
import {Post} from '../../types/player/player.type';
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

    getPostFeed: builder.infiniteQuery<Post[], void, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,

        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          return lastPageParam + 1;
        },
      },

      query({pageParam}) {
        return `/feed?pageSize=${POST_FEED_PAGE_SIZE}&pageNo=${pageParam}`;
      },
    }),
  }),
});

export const {
  useGetAvailableSportsQuery,
  useLazyGetAvailableSportsQuery,
  useLazyGetSearchedUsersQuery,
  useGetPostFeedInfiniteQuery,
} = coreApi;
