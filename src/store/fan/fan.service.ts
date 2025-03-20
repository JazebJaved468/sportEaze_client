import {RegisterFanParams} from '../../types/fan/fan.params';
import {RegisterFanResponse} from '../../types/fan/fan.response';
import {GetPlayerResponse} from '../../types/player/player.response';
import {Player} from '../../types/player/player.type';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';

export const fanApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    registerFan: builder.mutation<RegisterFanResponse, RegisterFanParams>({
      query: body => ({
        url: `/user/fan`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: RegisterFanResponse) => {
        return response;
      },

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          dispatch(updateUser(data));
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while registering fan : fan.service.ts : Line 30',
            err,
          );
        }
      },
    }),
  }),
});

export const {useRegisterFanMutation} = fanApi;
