import {GetPlayerResponse} from '../../types/player/player.response';
import {Player} from '../../types/player/player.type';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';

export const playerApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    getPlayerSettings: builder.query<Player, undefined>({
      query: id => ({
        url: `/user/player/get-player`,
      }),
      transformResponse: (response: GetPlayerResponse) => {
        return response.player;
      },

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          dispatch(updateUser(data.user));
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while getting player settings : player.service.ts : Line 22',
            err,
          );
        }
      },
    }),
  }),
});

export const {useGetPlayerSettingsQuery} = playerApi;
