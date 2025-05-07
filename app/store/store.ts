import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import leadReducer from "./features/leads/leadSlice";
import userReducer from "./features/users/userSlice";
import leadSourceReducer from "./features/leadSources/leadSourceSlice";
import leadTypeReducer from "./features/leadTypes/leadTypeSlice";
import clientReducer from "./features/clients/clientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    users: userReducer,
    leadSources: leadSourceReducer,
    leadTypes: leadTypeReducer,
    clients: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
