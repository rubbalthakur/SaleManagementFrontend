import { createSlice } from "@reduxjs/toolkit";
import { fetchLeadSourcesByOrganisation } from "./leadSourceService";
import { LeadSource } from "@/types/LeadSource";

interface LeadSourceState {
  leadSources: LeadSource[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadSourceState = {
  leadSources: [],
  loading: true,
  error: null,
};

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
