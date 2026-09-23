import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Doctors } from './pages/Doctors';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Specializations } from './pages/Specializations';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Hospital Management Dashboard';
      case '/doctors': return 'Doctors & Specializations';
      case '/patients': return 'Patient Records';
      case '/appointments': return 'Appointments Management';
      case '/specializations': return 'Specializations & Departments';
      case '/reports': return 'Reports & Analytics';
      case '/settings': return 'System Settings';
      default: return 'Hospital Management';
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={getPageTitle(location.pathname)} />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/doctors" element={<PrivateRoute><Layout><Doctors /></Layout></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><Layout><Patients /></Layout></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><Layout><Appointments /></Layout></PrivateRoute>} />
          <Route path="/specializations" element={<PrivateRoute><Layout><Specializations /></Layout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
