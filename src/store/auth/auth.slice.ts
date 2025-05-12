import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../types/auth/auth.type';
import {Player, Wallet} from '../../types/player/player.type';

interface AuthSliceType {
  userToken: string | null;
  isLoggedIn: boolean;
  userType: number;
  user: User | null;
  player: Player | null;
}

const initialState = {
  userToken: null,
  isLoggedIn: false,
  userType: 0,
  user: null,
  player: null,
} satisfies AuthSliceType as AuthSliceType;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },
    updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    updateUserType: (state, action: PayloadAction<number>) => {
      state.userType = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    updatePlayer: (state, action: PayloadAction<Player>) => {
      state.player = {
        ...state.player,
        ...action.payload,
      };
    },
    removeUser: state => {
      state.user = null;
    },
    removePlayer: state => {
      state.player = null;
    },

    updatePlayerWallet: (state, action: PayloadAction<{wallet: Wallet}>) => {
      if (state.user?.player) {
        state.user.player.wallet = {
          ...state.user.player.wallet,
          ...action.payload.wallet,
        };
      }
    },

    updatePatronWallet: (state, action: PayloadAction<{wallet: Wallet}>) => {
      if (state.user?.patron) {
        state.user.patron.wallet = {
          ...state.user.patron.wallet,
          ...action.payload.wallet,
        };
      }
    },
  },

  // extraReducers: builder => {
  //   // Add extra reducers here
  //   builder.addMatcher(
  //     authApi.endpoints.getUserSettings.matchFulfilled,
  //     (state, action) => {
  //       console.log('User Settings : ', action.payload);
  //       // state.user = action.payload.user;
  //     },
  //   );
  // },
});

export const {
  updatePatronWallet,
  updatePlayerWallet,
  updateUserToken,
  updateIsLoggedIn,
  updateUserType,
  updateUser,
  removeUser,
  updatePlayer,
  removePlayer,
} = authSlice.actions;
export default authSlice.reducer;
