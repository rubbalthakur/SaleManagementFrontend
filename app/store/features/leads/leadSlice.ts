import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLeadsForAdmin,
  fetchLeadsForUser,
  updateLead,
  addLead,
} from "./leadService";
import { Lead } from "@/types/Lead";

interface LeadState {
  leads: Lead[];
  loading: boolean;
  processing: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  loading: true,
  processing: false,
  error: null,
};

export const adminLeadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadsForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadsForAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeadsForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeadsForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadsForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeadsForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLead.pending, (state) => {
        state.processing = true;
      })
      .addCase(updateLead.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(updateLead.rejected, (state) => {
        state.processing = false;
      })
      .addCase(addLead.pending, (state) => {
        state.processing = true;
      })
      .addCase(addLead.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(addLead.rejected, (state) => {
        state.processing = false;
      });
  },
});

export default adminLeadSlice.reducer;
