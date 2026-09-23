import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserCheck, Users, CalendarCheck, Clock } from 'lucide-react';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { StatusBadge } from '../components/StatusBadge';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div>
      {/* Metrics Cards matching screenshot */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <UserCheck size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalDoctors}</div>
            <div className="stat-label">Doctors</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalPatients}</div>
            <div className="stat-label">Patients</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <CalendarCheck size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalAppointments}</div>
            <div className="stat-label">Appointments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-orange">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingAppointments}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Table matching screenshot */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Upcoming Appointments</h2>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td style={{ fontWeight: '600' }}>{appt.patientName}</td>
                    <td style={{ color: '#0284c7', fontWeight: '500' }}>{appt.doctorName}</td>
                    <td>{`${appt.appointmentDate} ${appt.timeSlot}`}</td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#64748b' }}>
                    No upcoming appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
