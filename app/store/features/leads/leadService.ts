import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { Lead } from "@/types/Lead";

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
        return response.data.Leads as Lead[];
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
        return response.data as Lead[];
      }
      return [] as Lead[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch leads");
    }
  }
);

//--------------------------update lead----------------------
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.UPDATE_LEAD, payload);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue("Failed to update Lead");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to update lead");
    }
  }
);

//---------------------------add lead----------------------------
export const addLead = createAsyncThunk(
  "leads/addLead",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.ADD_LEAD, payload);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue("Failed to add lead");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "failed to add lead");
    }
  }
);
