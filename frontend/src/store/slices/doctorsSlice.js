import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchSpecializations = createAsyncThunk(
  'doctors/fetchSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/specializations');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch specializations');
    }
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/doctors', doctorData);
      dispatch(fetchDoctors());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add doctor');
    }
  }
);

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctorsList: [],
    specializationsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorsList = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.specializationsList = action.payload;
      });
  },
});

export default doctorsSlice.reducer;
