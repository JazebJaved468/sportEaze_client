import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const sporteazeBaseApi = createApi({
  reducerPath: 'sporteazeBaseApi',
  baseQuery: fetchBaseQuery({baseUrl: process.env.SPORTEAZE_BASE_API}),
  endpoints: builder => ({}),
});

export const cloudinaryBaseApi = createApi({
  reducerPath: 'cloudinaryBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.CLOUDINARY_BASE_API,
  }),
  endpoints: builder => ({}),
});
