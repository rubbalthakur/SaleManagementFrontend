import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { User } from "@/types/Users";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: true,
  error: null,
};

//-------------------------fetch all users for organisation---------------
export const fetchUsersByOrganisation = createAsyncThunk(
  "users/fetchUsersByOrganisation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.GET_ALL_USER_ORGANISATION, {});

      if (
        response.data?.UserOrganisations &&
        Object.keys(response.data.UserOrganisations).length > 0
      ) {
        return response.data.UserOrganisations as User[];
      }
      return [] as User[];
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch users");
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByOrganisation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByOrganisation.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByOrganisation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
