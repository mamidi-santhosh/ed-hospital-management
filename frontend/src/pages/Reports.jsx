import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download } from 'lucide-react';

export const Reports = () => {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Hospital Analytics & Reports</h2>
        <button className="btn btn-outline">
          <Download size={18} /> Export PDF Report
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">94.2%</div>
            <div className="stat-label">Patient Satisfaction</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">340</div>
            <div className="stat-label">Monthly Appointments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹4.2L</div>
            <div className="stat-label">Consultation Revenue</div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title" style={{ marginBottom: '16px' }}>Monthly Appointment Breakdown</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Cardiology department accounted for 32% of total hospital visits this month, followed by General Medicine (28%) and Pediatrics (20%).
        </p>
      </div>
    </div>
  );
};
