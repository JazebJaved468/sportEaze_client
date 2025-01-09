import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStates} from '../../constants/core';

const coreSlice = createSlice({
  name: 'core',
  initialState: {
    appState: AppStates.ACTIVE,
    isFirstVisit: true,
  },
  reducers: {
    updateAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
    updateFirstVisit: (state, action: PayloadAction<boolean>) => {
      state.isFirstVisit = action.payload;
    },
  },
});

export const {updateAppState, updateFirstVisit} = coreSlice.actions;
export default coreSlice.reducer;
