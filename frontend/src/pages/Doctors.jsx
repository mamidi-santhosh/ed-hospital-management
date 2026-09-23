import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Award, Clock } from 'lucide-react';
import { fetchDoctors, fetchSpecializations, createDoctor } from '../store/slices/doctorsSlice';

export const Doctors = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { doctorsList: doctors, specializationsList: specializations } = useSelector((state) => state.doctors);

  const [selectedSpec, setSelectedSpec] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specializationId: '',
    qualification: 'MBBS, MD',
    experienceYears: 5,
    consultationFee: 500,
    availableDays: 'Mon-Fri',
    availableHours: '09:00 AM - 05:00 PM',
  });

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const result = await dispatch(createDoctor(formData));
    if (createDoctor.fulfilled.match(result)) {
      setShowModal(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name?.toLowerCase().includes(search.toLowerCase()) ||
                          doc.specializationName?.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpec ? doc.specializationId === parseInt(selectedSpec) : true;
    return matchesSearch && matchesSpec;
  });

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search by doctor name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <select 
            className="form-select"
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
        </div>

        {user?.role === 'ROLE_ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Doctor
          </button>
        )}
      </div>

      <div className="doctors-grid">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <img 
              src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'} 
              alt={doc.name} 
              className="doctor-avatar" 
            />
            <h3 className="doctor-name">Dr. {doc.name}</h3>
            <div className="doctor-spec">{doc.specializationName}</div>
            
            <div className="doctor-meta">
              <div><Award size={14} style={{ display: 'inline', marginRight: '4px' }} /> {doc.qualification} ({doc.experienceYears} yrs exp)</div>
              <div><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> {doc.availableDays} ({doc.availableHours})</div>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
              Fee: ₹{doc.consultationFee}
            </div>

            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Doctor</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddDoctor}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select 
                  className="form-select"
                  required
                  value={formData.specializationId}
                  onChange={(e) => setFormData({ ...formData, specializationId: e.target.value })}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
