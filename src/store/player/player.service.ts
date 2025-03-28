import {
  CreateMediaPostParams,
  CreateTextPostParams,
  FollowPlayerParams,
  RegisterPlayerParams,
} from '../../types/player/player.params';
import {
  CreateTextPostResponse,
  FollowPlayerResponse,
  registerPlayerResponse,
} from '../../types/player/player.response';
import {Post} from '../../types/player/player.type';
import {updateUserTypeOnRegister} from '../../utils/helpers/auth';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';

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

    createTextPost: builder.mutation<Post, CreateTextPostParams>({
      query: body => ({
        url: `/user/post/create-text-post`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: CreateTextPostResponse) => {
        return response.post;
      },
    }),

    createMediaPost: builder.mutation<Post, CreateMediaPostParams>({
      query: body => ({
        url: `/user/post/create-media-post`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: CreateTextPostResponse) => {
        return response.post;
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
} = playerApi;
