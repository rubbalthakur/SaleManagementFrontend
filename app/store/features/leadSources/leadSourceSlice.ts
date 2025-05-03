import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface LeadSource {
  id: number;
  leadSourceName: string;
}

interface LeadState {
  leadSources: LeadSource[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leadSources: [],
  loading: true,
  error: null,
};

export const fetchLeadSourcesByOrganisation = createAsyncThunk(
  "leadSources/fetchLeadSourcesByOrganisation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.GET_LEAD_SOURCE, {});
      if (response?.data?.LeadSources?.length > 0) {
        return response.data.LeadSources as LeadSource[];
      }
      return [] as LeadSource[];
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch leadSources");
    }
  }
);

export const userSlice = createSlice({
  name: "leadSources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadSourcesByOrganisation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadSourcesByOrganisation.fulfilled, (state, action) => {
        state.loading = false;
        state.leadSources = action.payload;
      })
      .addCase(fetchLeadSourcesByOrganisation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
