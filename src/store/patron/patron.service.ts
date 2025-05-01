import {RegisterPatronParams} from '../../types/patron/patron.params';
import {RegisterPlayerParams} from '../../types/player/player.params';
import {registerPlayerResponse} from '../../types/player/player.response';
import {updateUserTypeOnRegister} from '../../utils/helpers/auth';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';

export const patronApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    registerPatron: builder.mutation<
      registerPlayerResponse,
      RegisterPatronParams
    >({
      query: body => ({
        url: `/user/patron`,
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
            'Error while registering patron : patron.service.ts : Line 37',
            err,
          );
        }
      },
    }),
  }),
});

export const {useRegisterPatronMutation} = patronApi;
