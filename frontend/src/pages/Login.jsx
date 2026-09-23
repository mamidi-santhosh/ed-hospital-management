import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Lock, Mail } from 'lucide-react';
import { loginUser } from '../store/slices/authSlice';

export const Login = () => {
  const [email, setEmail] = useState('admin@hospital.com');
  const [password, setPassword] = useState('admin123');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Building2 size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Hospital Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Sign in to access your portal</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#ffe4e6', color: '#9f1239', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="email" 
                required
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="password" 
                required
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '12px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '13px', textAlign: 'center', color: '#64748b' }}>
          Demo Accounts:<br/>
          Admin: <b>admin@hospital.com</b> / admin123<br/>
          Doctor: <b>dr.priya@hospital.com</b> / doctor123<br/>
          Patient: <b>rahul@gmail.com</b> / patient123
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0284c7', fontWeight: '600', textDecoration: 'none' }}>Register as Patient</Link>
        </div>
      </div>
    </div>
  );
};
