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
import {RootState} from '../utils/customHooks/storeHooks';

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
      .concat(cloudinaryBaseApi.middleware),
});

const logger: Middleware = store => next => action => {
  console.log('Dispatching : ', action);
  next(action);
};

const apiStatusLogger = () => next => action => {
  if (isPending(action)) {
    console.log(`API Call Pending: ${action.type}`, action);
  } else if (isFulfilled(action)) {
    console.log(`API Call Successful: ${action.type}`, action);
  } else if (isRejected(action)) {
    console.log(`API Call Failed: ${action.type}`, action);
  }

  return next(action);
};
