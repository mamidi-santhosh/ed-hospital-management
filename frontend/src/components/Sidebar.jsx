import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Settings, 
  Building2,
  LogOut 
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Doctors', path: '/doctors', icon: UserCheck },
    { label: 'Patients', path: '/patients', icon: Users },
    { label: 'Appointments', path: '/appointments', icon: Calendar },
    { label: 'Specializations', path: '/specializations', icon: Stethoscope },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Building2 size={22} />
        </div>
        <div className="sidebar-title">Hospital Management</div>
      </div>

      <nav className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {user?.role?.replace('ROLE_', '') || 'PATIENT'}
            </div>
          </div>
        </div>

        <button 
          onClick={() => dispatch(logout())} 
          style={{ background: 'none', color: '#94a3b8', padding: '6px' }}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
