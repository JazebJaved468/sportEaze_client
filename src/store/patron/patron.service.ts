import {
  CreateContractParams,
  RegisterPatronParams,
  ReleaseFundsParams,
  UpdateContractParams,
} from '../../types/patron/patron.params';
import {Contract} from '../../types/patron/patron.type';
import {RegisterPlayerParams} from '../../types/player/player.params';
import {registerPlayerResponse} from '../../types/player/player.response';
import {updateUserTypeOnRegister} from '../../utils/helpers/auth';
import {
  onContractAccepted,
  onContractCreated,
  onContractUpdated,
} from '../../utils/helpers/contract.utils';
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

    //
    getContractsByUserId: builder.query<Contract[], {userId: string}>({
      query: ({userId}) => ({
        url: `/contracts/with-user/${userId}`,
      }),
      serializeQueryArgs: ({queryArgs, endpointName}) => {
        return `${endpointName}-${queryArgs.userId}`;
      },

      providesTags: ['ContractsByUserId'],
    }),

    getContractById: builder.query<Contract, {contractId: string}>({
      query: ({contractId}) => ({
        url: `/contracts/${contractId}`,
      }),

      // providesTags: (result, error, {contractId}) => {
      //   return [{type: 'ContractById', id: contractId}];
      // },

      providesTags: ['ContractById'],
    }),

    //
    createContract: builder.mutation<{}, CreateContractParams>({
      query: body => ({
        url: `/contracts`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          onContractCreated();
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while creating  contract : patron.service.ts : Line 37',
            err,
          );
        }
      },
    }),

    acceptContract: builder.mutation<{}, {contractId: string}>({
      query: ({contractId}) => ({
        url: `/contracts/accept/${contractId}`,
        method: 'PATCH',
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          await onContractAccepted(args.contractId);
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while accpeting  contract : patron.service.ts : Line 37',
            err,
          );
        }
      },
    }),

    updateContract: builder.mutation<Contract, UpdateContractParams>({
      query: ({contractId, ...body}) => ({
        url: `/contracts/${contractId}`,
        method: 'PATCH',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          console.log('data - on update', data);

          await onContractUpdated(args.contractId, data);
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while updating  contract : patron.service.ts : Line 37',
            err,
          );
        }
      },
    }),

    getMyContracts: builder.query<Contract[], {filter: number; userId: string}>(
      {
        query: ({filter}) => ({
          url: `/contracts?filter=${filter}`,
        }),

        serializeQueryArgs: ({queryArgs, endpointName}) => {
          return `${endpointName}-${queryArgs.filter}-${queryArgs.userId}`;
        },

        providesTags: ['MyContracts'],
      },
    ),

    //
    releaseFunds: builder.mutation<{}, ReleaseFundsParams>({
      query: body => ({
        url: `/contracts/release-funds`,
        method: 'POST',
        body,
      }),

      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        // // `onStart` side-effect

        try {
          const {data} = await queryFulfilled;
          // `onSuccess` side-effect

          // await onContractUpdated(args.contractId, data);
        } catch (err) {
          // `onError` side-effect
          console.log(
            'Error while releasing   contract funds : patron.service.ts : Line 37',
            err,
          );
        }
      },
    }),
  }),
});

export const {
  useReleaseFundsMutation,
  useGetMyContractsQuery,
  useUpdateContractMutation,
  useAcceptContractMutation,
  useGetContractByIdQuery,
  useRegisterPatronMutation,
  useGetContractsByUserIdQuery,
  useCreateContractMutation,
} = patronApi;
