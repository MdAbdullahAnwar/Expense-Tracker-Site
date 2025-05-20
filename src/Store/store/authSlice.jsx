import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  premiumActivated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
      state.premiumActivated = false;
    },
    activatePremium(state) {
      state.premiumActivated = true;
    },
    deactivatePremium(state) {
      state.premiumActivated = false;
    },
  },
});

export const { login, logout, activatePremium, deactivatePremium } = authSlice.actions;
export default authSlice.reducer;