import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { fetchAppointments, bookAppointment, updateAppointmentStatus, cancelAppointment } from '../store/slices/appointmentsSlice';
import { fetchDoctors } from '../store/slices/doctorsSlice';
import { StatusBadge } from '../components/StatusBadge';
import api from '../services/api';

export const Appointments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointmentsList: appointments } = useSelector((state) => state.appointments);
  const { doctorsList: doctors } = useSelector((state) => state.doctors);

  const [patients, setPatients] = useState([]);
  const [currentPatientProfile, setCurrentPatientProfile] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const [booking, setBooking] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '10:00 AM',
    reason: 'General Consultation',
  });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    
    if (user?.role === 'ROLE_PATIENT') {
      fetchCurrentPatientProfile();
    } else {
      fetchPatients();
    }
  }, [dispatch, user]);

  const fetchCurrentPatientProfile = async () => {
    try {
      const res = await api.get(`/patients/user/${user.id}`);
      setCurrentPatientProfile(res.data);
      setBooking((prev) => ({ ...prev, patientId: res.data.id }));
    } catch (err) {
      console.error('Patient profile not found:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    const finalPatientId = user?.role === 'ROLE_PATIENT' ? currentPatientProfile?.id : booking.patientId;
    
    if (!finalPatientId) {
      alert('Patient profile not selected');
      return;
    }

    const payload = { ...booking, patientId: finalPatientId };
    const result = await dispatch(bookAppointment(payload));
    if (bookAppointment.fulfilled.match(result)) {
      setShowModal(false);
    }
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAppointmentStatus({ id, status, notes: 'Updated from portal' }));
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(id));
    }
  };

  // Filter appointments: If user is PATIENT, strictly show ONLY their appointments!
  const patientFilteredAppointments = user?.role === 'ROLE_PATIENT'
    ? appointments.filter((a) => a.patientName === user.name)
    : appointments;

  const filteredAppointments = patientFilteredAppointments.filter((a) =>
    filterStatus === 'ALL' ? true : a.status === filterStatus
  );

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '13px', padding: '6px 14px' }}
            >
              {st}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      <div className="section-card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td style={{ fontWeight: '600' }}>{appt.patientName}</td>
                    <td style={{ color: '#0284c7', fontWeight: '500' }}>{appt.doctorName}</td>
                    <td>{appt.specializationName}</td>
                    <td>{`${appt.appointmentDate} at ${appt.timeSlot}`}</td>
                    <td>{appt.reason}</td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user?.role !== 'ROLE_PATIENT' && appt.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}
                            style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', border: 'none' }}
                            title="Confirm"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {appt.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancel(appt.id)}
                            style={{ background: '#ffe4e6', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                            title="Cancel Appointment"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>
                    {user?.role === 'ROLE_PATIENT' ? 'You have no appointments booked yet.' : 'No appointments match the selected filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Book New Appointment</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleBook}>
              {user?.role === 'ROLE_PATIENT' ? (
                <div className="form-group">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    disabled
                    className="form-input"
                    value={`${user.name} (${user.email})`}
                    style={{ backgroundColor: '#f1f5f9' }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Select Patient</label>
                  <select
                    className="form-select"
                    required
                    value={booking.patientId}
                    onChange={(e) => setBooking({ ...booking, patientId: e.target.value })}
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Select Doctor</label>
                <select
                  className="form-select"
                  required
                  value={booking.doctorId}
                  onChange={(e) => setBooking({ ...booking, doctorId: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>Dr. {d.name} ({d.specializationName})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={booking.appointmentDate}
                    onChange={(e) => setBooking({ ...booking, appointmentDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select
                    className="form-select"
                    value={booking.timeSlot}
                    onChange={(e) => setBooking({ ...booking, timeSlot: e.target.value })}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Symptoms</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={booking.reason}
                  onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
