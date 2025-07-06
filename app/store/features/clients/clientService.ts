import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { Client } from "@/types/Client";

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_CONFIG.GET_ALL_CLIENT_BY_ORGANISATION
      );
      if (response.data?.OrganisationProfile?.Clients.length > 0) {
        return response.data.OrganisationProfile.Clients as Client[];
      }
      return [] as Client[];
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "error in fetching clients");
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.UPDATE_CLIENT, payload);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue("Failed to update Client");
      }
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to update Client");
    }
  }
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post(API_CONFIG.ADD_CLIENT, payload);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue("Failed to Add Client");
      }
    } catch (error: unknown) {
      return rejectWithValue((error as any).message || "Failed to Add Client");
    }
  }
);
