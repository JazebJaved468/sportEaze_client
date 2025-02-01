import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStates} from '../../constants/core';
import {ToastType} from '../../types/core/core.type';

interface CoreSliceType {
  appState: string;
  isFirstVisit: boolean;
  toast: ToastType;
}

const initialState = {
  appState: AppStates.ACTIVE,
  isFirstVisit: true,
  toast: {
    message: '',
    isVisible: false,
  },
} satisfies CoreSliceType as CoreSliceType;

const coreSlice = createSlice({
  name: 'core',
  initialState: initialState,
  reducers: {
    updateAppState: (state, action: PayloadAction<string>) => {
      state.appState = action.payload;
    },
    updateFirstVisit: (state, action: PayloadAction<boolean>) => {
      state.isFirstVisit = action.payload;
    },
    updateToast: (state, action: PayloadAction<ToastType>) => {
      state.toast = {...state.toast, ...action.payload};
    },
  },
});

export const {updateAppState, updateFirstVisit, updateToast} =
  coreSlice.actions;
export default coreSlice.reducer;
