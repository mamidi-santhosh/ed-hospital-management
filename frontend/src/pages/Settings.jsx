import React from 'react';
import { Save, Building, Shield, Bell } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="section-card" style={{ maxWidth: '720px' }}>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>Hospital System Settings</h2>

      <form onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
        <div className="form-group">
          <label className="form-label">Hospital Name</label>
          <input type="text" className="form-input" defaultValue="City General Hospital & Medical Center" />
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Helpline Number</label>
          <input type="text" className="form-input" defaultValue="+91 (040) 2345-6789" />
        </div>

        <div className="form-group">
          <label className="form-label">Hospital Address</label>
          <input type="text" className="form-input" defaultValue="Plot 42, Healthcare Avenue, Tech City" />
        </div>

        <div className="form-group">
          <label className="form-label">Appointment Cancellation Policy</label>
          <select className="form-select" defaultValue="24">
            <option value="12">Up to 12 Hours before</option>
            <option value="24">Up to 24 Hours before</option>
            <option value="48">Up to 48 Hours before</option>
          </select>
        </div>

        <div style={{ marginTop: '28px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
