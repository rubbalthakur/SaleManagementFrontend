import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { LeadSource } from "@/types/LeadSource";

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
