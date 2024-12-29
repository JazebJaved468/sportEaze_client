import {configureStore, Middleware} from '@reduxjs/toolkit';
import sampleReducer from './sample/sample.slice';
import {sporteazeBaseApi, cloudinaryBaseApi} from './baseApi.service';
import coreReducer from './core/core.slice';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    core: coreReducer,
    [sporteazeBaseApi.reducerPath]: sporteazeBaseApi.reducer,
    [cloudinaryBaseApi.reducerPath]: cloudinaryBaseApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(sporteazeBaseApi.middleware)
      .concat(cloudinaryBaseApi.middleware),
});
