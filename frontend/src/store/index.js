import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import doctorsReducer from './slices/doctorsSlice';
import appointmentsReducer from './slices/appointmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
  },
  // Redux Toolkit includes Redux Thunk middleware by default!
});

export default store;
