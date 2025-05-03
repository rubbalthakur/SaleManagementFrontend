import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import leadReducer from "./features/leads/leadSlice";
import userReducer from "./features/users/userSlice";
import leadSourceReducer from "./features/leadSources/leadSourceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    users: userReducer,
    leadSources: leadSourceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
