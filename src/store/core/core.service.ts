import {POST_FEED_PAGE_SIZE} from '../../constants/core';
import {ConnectionReqResponse, ConnectionStatus} from '../../constants/enums';
import {
  ConnectUserParams,
  RespondConnectionRequestParams,
} from '../../types/core/core.params';
import {
  AvailableSportsResponse,
  ConnectUserResponse,
} from '../../types/core/core.response';
import {UserWindow} from '../../types/core/core.type';
import {Post} from '../../types/player/player.type';
import {authApi} from '../auth/auth.service';
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

    connetUser: builder.mutation<ConnectUserResponse, ConnectUserParams>({
      query: ({receiverId}) => ({
        url: `/network/connect`,
        method: 'POST',
        body: {receiverId},
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          console.log('response - connect user', data);

          dispatch(
            authApi.util.updateQueryData(
              'getUserByIdService',
              {userId: args.receiverId},
              draft => {
                draft.connection = data.connection;
              },
            ),
          );
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while adding connecting user : core.service.ts : Line 48',
            err,
          );
        }
      },

      transformResponse: (response: ConnectUserResponse) => {
        return response;
      },
    }),

    respondConnectionRequest: builder.mutation<
      {},
      RespondConnectionRequestParams
    >({
      query: body => ({
        url: `/network/connect/respond`,
        method: 'PATCH',
        body: {
          requesterId: body.requesterId,
          action: body.action,
        },
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(
            authApi.util.updateQueryData(
              'getUserByIdService',
              {userId: args.requesterId},
              draft => {
                draft.connection = {
                  ...draft.connection,
                  status:
                    args.action === ConnectionReqResponse.ACCEPT
                      ? ConnectionStatus.ACCEPTED
                      : ConnectionStatus.REJECTED,
                };
              },
            ),
          );
        } catch (err) {
          console.log(
            'Error while Updating user data : auth.service.ts : Line 66',
            err,
          );
        }
      },
    }),

    removeConnection: builder.mutation<{}, {connectionId: string}>({
      query: ({connectionId}) => ({
        url: `/network/connections/${connectionId}`,
        method: 'DELETE',
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('response - remove connection', data);
          dispatch(
            authApi.util.updateQueryData(
              'getUserByIdService',
              {userId: args.connectionId},
              draft => {
                draft.connection = {
                  status: ConnectionStatus.REJECTED,
                };
              },
            ),
          );
        } catch (err) {
          console.log(
            'Error while Updating user data : auth.service.ts : Line 66',
            err,
          );
        }
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
  useConnetUserMutation,
  useRemoveConnectionMutation,
  useRespondConnectionRequestMutation,
} = coreApi;
