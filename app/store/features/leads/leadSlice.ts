import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

import { Lead } from "@/types/Lead";

interface LeadUser {
  id: number;
  userId: number;
  organisationId: number;
  leadTypeId: number;
  leadSourceId: number;
  status: string;
  description: string;
  User: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
  LeadType: {
    leadTypeName: string;
  };
  LeadSource: {
    leadSourceName: string;
  };
}

interface LeadState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  loading: true,
  error: null,
};

//------------------fetch all leads for admin----------------------
export const fetchLeadsForAdmin = createAsyncThunk(
  "leads/fetchLeadsForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_CONFIG.GET_ALL_LEAD_BY_ORGANISATION,
        {}
      );
      if (
        response?.data?.Leads &&
        Object.keys(response.data.Leads).length > 0
      ) {
        return response.data.Leads.map((leadUser: LeadUser) => ({
          id: leadUser.id,
          userId: leadUser.userId,
          organisationId: leadUser.organisationId,
          leadSourceId: leadUser.leadSourceId,
          leadTypeId: leadUser.leadTypeId,
          status: leadUser.status,
          description: leadUser.description,
          firstName: leadUser.User.firstName,
          lastName: leadUser.User.lastName,
          emailId: leadUser.User.emailId,
          leadSourceName: leadUser.LeadSource.leadSourceName,
          leadTypeName: leadUser.LeadType.leadTypeName,
        })) as Lead[];
      }
      return [] as Lead[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch leads");
    }
  }
);

//-----------------------fetch leads for user--------------------
export const fetchLeadsForUser = createAsyncThunk(
  "leads/fetchLeadsForUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.GET_LEAD_BY_USER, {});
      if (response.data && response.data.length > 0) {
        return response.data.map((leadUser: LeadUser) => ({
          id: leadUser.id,
          userId: leadUser.userId,
          organisationId: leadUser.organisationId,
          leadSourceId: leadUser.leadSourceId,
          leadTypeId: leadUser.leadTypeId,
          status: leadUser.status,
          description: leadUser.description,
          firstName: leadUser.User.firstName,
          lastName: leadUser.User.lastName,
          emailId: leadUser.User.emailId,
          leadSourceName: leadUser.LeadSource.leadSourceName,
          leadTypeName: leadUser.LeadType.leadTypeName,
        })) as Lead[];
      }
      return [] as Lead[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch leads");
    }
  }
);

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
      });
  },
});

export default adminLeadSlice.reducer;
