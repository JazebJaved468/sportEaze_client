import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStates} from '../../constants/core';

const coreSlice = createSlice({
  name: 'core',
  initialState: {
    appState: AppStates.ACTIVE,
  },
  reducers: {
    updateAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
  },
});

export const {updateAppState} = coreSlice.actions;
export default coreSlice.reducer;
