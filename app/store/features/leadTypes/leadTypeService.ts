import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { LeadType } from "@/types/LeadType";

export const fetchLeadTypesByOrganisation = createAsyncThunk(
  "leadTypes/fetchLeadTypesByOrganisation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.GET_LEAD_TYPE, {});
      if (response?.data?.LeadTypes?.length > 0) {
        return response.data.LeadTypes as LeadType[];
      }
      return [] as LeadType[];
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to fetch leadTypes");
    }
  }
);
