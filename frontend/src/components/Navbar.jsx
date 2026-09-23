import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, Search } from 'lucide-react';

export const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="top-navbar">
      <h1 className="page-title">{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search doctors, patients..." 
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', borderRadius: '20px' }}
          />
        </div>

        <button style={{ background: '#f1f5f9', padding: '8px', borderRadius: '50%', color: '#475569', display: 'flex' }}>
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
