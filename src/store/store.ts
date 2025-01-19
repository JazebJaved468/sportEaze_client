import {
  configureStore,
  isFulfilled,
  isPending,
  isRejected,
  Middleware,
} from '@reduxjs/toolkit';
import sampleReducer from './sample/sample.slice';
import {sporteazeBaseApi, cloudinaryBaseApi} from './baseApi.service';
import coreReducer from './core/core.slice';
import authReducer from './auth/auth.slice';
import {apiStatusLogger} from '../utils/customHooks/helpers/logger';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    core: coreReducer,
    auth: authReducer,
    [sporteazeBaseApi.reducerPath]: sporteazeBaseApi.reducer,
    [cloudinaryBaseApi.reducerPath]: cloudinaryBaseApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(sporteazeBaseApi.middleware)
      .concat(cloudinaryBaseApi.middleware)
      .concat(apiStatusLogger),
});
