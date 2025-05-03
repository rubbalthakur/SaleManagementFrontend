import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface User {
  userId: number;
  roleId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface UserOrgData {
  userId: number;
  roleId: number;
  User?: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
  Role?: {
    role: string;
  };
}

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

//-------------------------fetch all users for organisation----------------------------
export const fetchUsersByOrganisation = createAsyncThunk(
  "users/fetchUsersByOrganisation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.GET_ALL_USER_ORGANISATION, {});

      if (
        response.data?.UserOrganisations &&
        Object.keys(response.data.UserOrganisations).length > 0
      ) {
        return response.data.UserOrganisations.map((userOrg: UserOrgData) => ({
          userId: userOrg.userId,
          roleId: userOrg.roleId,
          email: userOrg.User?.emailId,
          firstName: userOrg.User?.firstName,
          lastName: userOrg.User?.lastName,
          role: userOrg.Role?.role,
        }));
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
