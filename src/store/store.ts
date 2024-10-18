import {configureStore} from '@reduxjs/toolkit';
import sampleReducer from './sample/sample.slice';
import {baseApi} from './baseApi.service';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
