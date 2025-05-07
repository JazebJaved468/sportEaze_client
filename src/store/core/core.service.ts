import {POST_FEED_PAGE_SIZE} from '../../constants/core';
import {ConnectionReqResponse, ConnectionStatus} from '../../constants/enums';
import {
  ConnectUserParams,
  MarkChatAsReadParams,
  RespondConnectionRequestParams,
} from '../../types/core/core.params';
import {
  AvailableSportsResponse,
  ConnectUserResponse,
  GetAcceptedConnectionsResponse,
  GetChatListingResponse,
  GetChatMessagesResponse,
  GetPendingConnectionsResponse,
} from '../../types/core/core.response';
import {UserWindow} from '../../types/core/core.type';
import {Post} from '../../types/player/player.type';
import {RootState} from '../../utils/customHooks/storeHooks';
import {onChatRead} from '../../utils/helpers/chat.utils';
import {authApi} from '../auth/auth.service';
import {sporteazeBaseApi} from '../baseApi.service';
import {store} from '../store';

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

    requestConnectUser: builder.mutation<
      ConnectUserResponse,
      ConnectUserParams
    >({
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

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
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

          dispatch(
            coreApi.util.updateQueryData(
              'getPendingConnections',
              {userId: (getState() as RootState).auth?.user?.id},
              draft => {
                draft = draft.filter(item => item.user.id !== args.requesterId);
                return draft;
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

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const {data} = await queryFulfilled;
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

          dispatch(
            coreApi.util.updateQueryData(
              'getAcceptedConnections',
              {userId: (getState() as RootState).auth?.user?.id},
              draft => {
                draft.connections.connections =
                  draft.connections.connections.filter(
                    item => item.id !== args.connectionId,
                  );
                return draft;
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

    getPendingConnections: builder.query<
      GetPendingConnectionsResponse,
      {userId?: string}
    >({
      query: () => ({
        url: `/network/connect/pending`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.userId}`;
      },
      providesTags: ['PendingConnections'],
    }),

    getAcceptedConnections: builder.query<
      GetAcceptedConnectionsResponse,
      {userId?: string}
    >({
      query: () => ({
        url: `/network/connect/get-all-connections`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.userId}`;
      },
    }),

    getMyFollowings: builder.query<UserWindow[], {userId?: string}>({
      query: ({userId}) => ({
        url: `/network/following/${userId}`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.userId}`;
      },
      providesTags: ['MyFollowings'],
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

    getChatMessages: builder.query<
      GetChatMessagesResponse,
      {receiverId: string}
    >({
      query: ({receiverId}) => ({
        url: `/chat/${receiverId}`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.receiverId}-${(store.getState() as RootState).auth?.user?.id}`;
      },
    }),

    getChatListing: builder.query<GetChatListingResponse[], {userId: string}>({
      query: ({userId}) => ({
        url: `/chat/user/${userId}`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.userId}`;
      },
    }),

    //

    markChatAsRead: builder.mutation<ConnectUserResponse, MarkChatAsReadParams>(
      {
        query: ({chatId, user2Id}) => ({
          url: `/chat/read/${chatId}`,
          method: 'POST',
        }),

        async onQueryStarted(args, {dispatch, queryFulfilled}) {
          // // `onStart` side-effect

          try {
            const {data} = await queryFulfilled;
            // `onSuccess` side-effect
            console.log('response - chat read success', data);

            onChatRead(args.chatId, args.user2Id);
          } catch (err) {
            // `onError` side-effect
            console.log(
              'Error while marking chat as read : core.service.ts : Line 274',
              err,
            );
          }
        },
      },
    ),
  }),
});

export const {
  useMarkChatAsReadMutation,
  useGetChatListingQuery,
  useGetChatMessagesQuery,
  useGetAvailableSportsQuery,
  useLazyGetAvailableSportsQuery,
  useLazyGetSearchedUsersQuery,
  useGetPostFeedInfiniteQuery,
  useRemoveConnectionMutation,
  useRespondConnectionRequestMutation,
  useRequestConnectUserMutation,
  useGetPendingConnectionsQuery,
  useGetAcceptedConnectionsQuery,
  useGetMyFollowingsQuery,
} = coreApi;
