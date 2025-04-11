import {
  CreateCommentOnPostParams,
  CreateLikeOnPostParams,
  CreateMediaPostParams,
  CreateTextPostParams,
  FollowPlayerParams,
  RegisterPlayerParams,
} from '../../types/player/player.params';
import {
  CommmentsByPostIdResponse,
  CreateCommentOnPostResponse,
  CreateLikeOnPostResponse,
  CreateTextPostResponse,
  FollowPlayerResponse,
  GetPostIdResponse,
  GetPostsByPlayerIdResponse,
  LikesByPostIdResponse,
  registerPlayerResponse,
} from '../../types/player/player.response';
import {CreatePost, Post} from '../../types/player/player.type';
import {updateUserTypeOnRegister} from '../../utils/helpers/auth';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';
import {coreApi} from '../core/core.service';

export const playerApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    registerPlayer: builder.mutation<
      registerPlayerResponse,
      RegisterPlayerParams
    >({
      query: body => ({
        url: `/user/player`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: registerPlayerResponse) => {
        return response;
      },

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          await updateUserTypeOnRegister({
            userType: data.user.userType,
          });
          dispatch(updateUser(data.user));
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while registering player : fan.service.ts : Line 30',
            err,
          );
        }
      },
    }),

    followPlayer: builder.mutation<FollowPlayerResponse, FollowPlayerParams>({
      query: ({playerId}) => ({
        url: `/network/follow/${playerId}`,
        method: 'POST',
      }),
      transformResponse: (response: FollowPlayerResponse) => {
        console.log('response - follow player', response);
        return response;
      },
    }),

    unfollowPlayer: builder.mutation<FollowPlayerResponse, FollowPlayerParams>({
      query: ({playerId}) => ({
        url: `/network/unfollow/${playerId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: FollowPlayerResponse) => {
        console.log('response - unfollow player', response);
        return response;
      },
    }),

    createTextPost: builder.mutation<CreatePost, CreateTextPostParams>({
      query: body => ({
        url: `/user/post/create-text-post`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: CreateTextPostResponse) => {
        return response.post;
      },
    }),

    createMediaPost: builder.mutation<CreatePost, CreateMediaPostParams>({
      query: body => ({
        url: `/user/post/create-media-post`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: CreateTextPostResponse) => {
        return response.post;
      },
    }),

    getPlayerPostsByPlayerIdService: builder.query<Post[], {playerId: string}>({
      query: ({playerId}) => ({
        url: `/user/post/get-posts/${playerId}`,
        params: {
          pageNo: 1,
          pageSize: 15,
        },
      }),
      transformResponse: (response: GetPostsByPlayerIdResponse) => {
        return response.posts;
      },
    }),

    getPostByIdService: builder.query<Post, {postId: string}>({
      query: ({postId}) => ({
        url: `/user/post/get-post/${postId}`,
      }),
      transformResponse: (response: GetPostIdResponse) => {
        return response.post;
      },
    }),

    getCommentsByPostIdService: builder.query<
      CommmentsByPostIdResponse,
      {postId: string}
    >({
      query: ({postId}) => ({
        url: `/user/post/comments/${postId}`,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          dispatch(
            playerApi.util.updateQueryData(
              'getPostByIdService',
              {postId: args.postId},
              draft => {
                draft.commentCount = data.commentCount;
              },
            ),
          );

          dispatch(
            coreApi.util.updateQueryData('getPostFeed', undefined, draft => {
              draft.pages.forEach((postPage, index) => {
                const postIndex = postPage.findIndex(
                  post => post.id === args.postId,
                );

                if (postIndex !== -1) {
                  const draftPost = postPage[postIndex];
                  draftPost.commentCount = data.commentCount;
                  return;
                }
              });
            }),
          );
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while commenting post : player.service.ts : Line 155',
            err,
          );
        }
      },

      transformResponse: (response: CommmentsByPostIdResponse) => {
        return response;
      },
    }),

    createComment: builder.mutation<
      CreateCommentOnPostResponse,
      CreateCommentOnPostParams
    >({
      query: ({content, postId, parentCommentId}) => ({
        url: `/user/post/comment/${postId}`,
        method: 'POST',
        body: {
          content,
          parentCommentId,
        },
      }),
      transformResponse: (response: CreateCommentOnPostResponse) => {
        return response;
      },
    }),

    getLikesByPostIdService: builder.query<
      LikesByPostIdResponse,
      {postId: string}
    >({
      query: ({postId}) => ({
        url: `/user/post/likes/${postId}`,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(
            playerApi.util.updateQueryData(
              'getPostByIdService',
              {postId: args.postId},
              draft => {
                draft.likeCount = data.likeCount;
              },
            ),
          );

          dispatch(
            coreApi.util.updateQueryData('getPostFeed', undefined, draft => {
              draft.pages.forEach((postPage, index) => {
                const postIndex = postPage.findIndex(
                  post => post.id === args.postId,
                );

                if (postIndex !== -1) {
                  const draftPost = postPage[postIndex];
                  draftPost.likeCount = data.likeCount;
                  return;
                }
              });
            }),
          );
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while registering player : fan.service.ts : Line 30',
            err,
          );
        }
      },

      transformResponse: (response: LikesByPostIdResponse) => {
        return response;
      },
    }),

    createLikeOrUnLike: builder.mutation<
      CreateLikeOnPostResponse,
      CreateLikeOnPostParams
    >({
      query: ({postId, unLike}) => ({
        url: `/user/post/like/${postId}`,
        method: 'POST',
        body: {
          unLike,
        },
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          // fall back update
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while registering player : fan.service.ts : Line 30',
            err,
          );
        }
      },
      transformResponse: (response: CreateLikeOnPostResponse) => {
        return response;
      },
    }),
  }),
});

export const {
  useRegisterPlayerMutation,
  useFollowPlayerMutation,
  useUnfollowPlayerMutation,
  useCreateTextPostMutation,
  useCreateMediaPostMutation,
  useGetPlayerPostsByPlayerIdServiceQuery,
  useGetPostByIdServiceQuery,
  useGetCommentsByPostIdServiceQuery,
  useLazyGetCommentsByPostIdServiceQuery,
  useCreateCommentMutation,
  useLazyGetLikesByPostIdServiceQuery,
  useCreateLikeOrUnLikeMutation,
} = playerApi;
