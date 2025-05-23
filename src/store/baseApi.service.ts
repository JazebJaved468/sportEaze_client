import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {store} from './store';
import {getFromLocalStorage} from '../utils/helpers/asyncStorage';

// console.log('Base URL:', process.env.SPORTEAZE_BASE_API);

// export const SPORTEAZE_BASE_API = 'http://192.168.100.3:3000';
// export const SPORTEAZE_SOCKET_API = 'ws://192.168.100.3:3000';

// release
export const SPORTEAZE_BASE_API = 'https://sporteaze-server.onrender.com';
export const SPORTEAZE_SOCKET_API = 'ws://sporteaze-server.onrender.com'; // Log the base URL

export const sporteazeBaseApi = createApi({
  reducerPath: 'sporteazeBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SPORTEAZE_BASE_API}/api`,
    prepareHeaders: headers => {
      const {userToken} = store.getState().auth;
      if (userToken) {
        headers.set('authorization', `Bearer ${userToken}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'MyFollowings',
    'PendingConnections',
    'ContractsByUserId',
    'ContractById',
    'MyContracts',
    'PlayerEndorsements',
    'MentorEndorsements',
  ],

  endpoints: builder => ({}),
});

export const cloudinaryBaseApi = createApi({
  reducerPath: 'cloudinaryBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.CLOUDINARY_BASE_API,
  }),
  endpoints: builder => ({}),
});

// const createDynamicBaseQuery = () => {
//   return async (args: any, api: any, extraOptions: any) => {
//     // Get the server domain each time a request is made
//     const serverDomain =
//       (await getFromLocalStorage({key: 'serverDomain'})) || 'api.sporteaze.com';

//     // Construct the URL dynamically
//     const baseUrl = `https://${serverDomain}/api`;

//     console.log('Base URL:', baseUrl); // Log the dynamic base URL

//     // Create a new base query with the dynamic URL
//     const dynamicBaseQuery = fetchBaseQuery({
//       baseUrl,
//       prepareHeaders: headers => {
//         const {userToken} = store.getState().auth;
//         if (userToken) {
//           headers.set('authorization', `Bearer ${userToken}`);
//         }
//         headers.set('Content-Type', 'application/json');
//         return headers;
//       },
//     });

//     // Use the dynamic base query to execute the request
//     return dynamicBaseQuery(args, api, extraOptions);
//   };
// };
