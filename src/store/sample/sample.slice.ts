import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const sampleSlice = createSlice({
  name: 'sample',
  initialState: {
    message: 'Go Next',
  },
  reducers: {
    updateMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const {updateMessage} = sampleSlice.actions;
export default sampleSlice.reducer;
