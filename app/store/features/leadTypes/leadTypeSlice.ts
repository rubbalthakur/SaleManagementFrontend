import { createSlice } from "@reduxjs/toolkit";
import { fetchLeadTypesByOrganisation } from "./leadTypeService";
import { LeadType } from "@/types/LeadType";

interface LeadTypeState {
  leadTypes: LeadType[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadTypeState = {
  leadTypes: [],
  loading: true,
  error: null,
};

export const userSlice = createSlice({
  name: "leadTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadTypesByOrganisation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadTypesByOrganisation.fulfilled, (state, action) => {
        state.loading = false;
        state.leadTypes = action.payload;
      })
      .addCase(fetchLeadTypesByOrganisation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
