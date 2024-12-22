import {configureStore, Middleware} from '@reduxjs/toolkit';
import sampleReducer from './sample/sample.slice';
import {sporteazeBaseApi, cloudinaryBaseApi} from './baseApi.service';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    [sporteazeBaseApi.reducerPath]: sporteazeBaseApi.reducer,
    [cloudinaryBaseApi.reducerPath]: cloudinaryBaseApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(sporteazeBaseApi.middleware)
      .concat(cloudinaryBaseApi.middleware),
});
