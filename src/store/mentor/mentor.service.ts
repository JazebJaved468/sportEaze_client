import {User} from '../../types/auth/auth.type';
import {RegisterMentorParams} from '../../types/mentor/mentor.params';
import {updateUserTypeOnRegister} from '../../utils/helpers/auth';
import {updateUser} from '../auth/auth.slice';
import {sporteazeBaseApi} from '../baseApi.service';

export const mentorApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    registerMentor: builder.mutation<User, RegisterMentorParams>({
      query: body => ({
        url: `/user/mentor`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect
          await updateUserTypeOnRegister({
            userType: data.userType,
          });
          dispatch(updateUser(data));
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while registering mentor : mentor.service.ts : Line 30',
            err,
          );
        }
      },
    }),
  }),
});

export const {useRegisterMentorMutation} = mentorApi;
