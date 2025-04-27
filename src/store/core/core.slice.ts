import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStates} from '../../constants/core';
import {ToastType} from '../../types/core/core.type';
import {updateUser} from '../auth/auth.slice';

interface CoreSliceType {
  appState: string;
  isFirstVisit: boolean;
  toast: ToastType;
  userConsent: boolean;
}

const initialState = {
  appState: AppStates.ACTIVE,
  isFirstVisit: true,
  toast: {
    message: '',
    isVisible: false,
  },
  userConsent: true,
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
    updateUserConsent: (state, action: PayloadAction<boolean>) => {
      state.userConsent = action.payload;
    },
  },
});

export const {
  updateAppState,
  updateFirstVisit,
  updateToast,
  updateUserConsent,
} = coreSlice.actions;
export default coreSlice.reducer;
