import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {store} from './store';

export const sporteazeBaseApi = createApi({
  reducerPath: 'sporteazeBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.SPORTEAZE_BASE_API,
    prepareHeaders: headers => {
      const {userToken} = store.getState().auth;
      if (userToken) {
        headers.set('authorization', `Bearer ${userToken}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['MyFollowings'],

  endpoints: builder => ({}),
});

export const cloudinaryBaseApi = createApi({
  reducerPath: 'cloudinaryBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.CLOUDINARY_BASE_API,
  }),
  endpoints: builder => ({}),
});
