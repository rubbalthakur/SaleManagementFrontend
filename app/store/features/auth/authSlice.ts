import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  loggedInUserId: number | null;
  roleId: number | null;
}
const initialState: AuthState = {
  loggedInUserId: null,
  roleId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //----------logged in user id-----------
    setLoggedInUserId: (state, action: PayloadAction<number | null>) => {
      state.loggedInUserId = action.payload;
    },

    //----------roleId of user----------
    setRoleId: (state, action: PayloadAction<number | null>) => {
      state.roleId = action.payload;
    },
    //-----------clear auth state function----------
    clearAuth: (state) => {
      state.loggedInUserId = null;
      state.roleId = null;
    },
  },
});

export const { setLoggedInUserId, clearAuth, setRoleId } = authSlice.actions;

export default authSlice.reducer;
