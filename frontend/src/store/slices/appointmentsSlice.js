import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { fetchDashboardStats } from './dashboardSlice';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (bookingData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/appointments', bookingData);
      dispatch(fetchAppointments());
      dispatch(fetchDashboardStats());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to book appointment');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status, notes }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status, notes });
      dispatch(fetchAppointments());
      dispatch(fetchDashboardStats());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/appointments/${id}/cancel`);
      dispatch(fetchAppointments());
      dispatch(fetchDashboardStats());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointmentsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentsList = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;
