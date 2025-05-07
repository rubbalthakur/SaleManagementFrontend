import { createSlice } from "@reduxjs/toolkit";
import { fetchClients, updateClient, addClient } from "./clientService";
import { Client } from "@/types/Client";

interface ClientState {
  clients: Client[];
  loading: boolean;
  processing: boolean;
  error: null | string;
}

const initialState: ClientState = {
  clients: [],
  loading: true,
  processing: false,
  error: null,
};

export const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateClient.pending, (state) => {
        state.processing = true;
      })
      .addCase(updateClient.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(updateClient.rejected, (state) => {
        state.processing = false;
      })
      .addCase(addClient.pending, (state) => {
        state.processing = true;
      })
      .addCase(addClient.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(addClient.rejected, (state) => {
        state.processing = false;
      });
  },
});

export default clientSlice.reducer;
