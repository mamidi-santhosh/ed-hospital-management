import React, { useEffect, useState } from 'react';
import { Stethoscope, Plus, Activity, Heart, Brain, Baby, Bone } from 'lucide-react';
import api from '../services/api';

export const Specializations = () => {
  const [specs, setSpecs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSpec, setNewSpec] = useState({ name: '', description: '', iconName: 'Stethoscope' });

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const res = await api.get('/specializations');
      setSpecs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/specializations', newSpec);
      setShowModal(false);
      fetchSpecializations();
    } catch (err) {
      alert('Failed to add specialization');
    }
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Hospital Specializations & Departments</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Department
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {specs.map((spec) => (
          <div key={spec.id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div className="stat-icon-wrapper stat-icon-blue">
                <Stethoscope size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{spec.name}</h3>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>Department Active</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '16px' }}>
              {spec.description}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Specialization</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  value={newSpec.name}
                  onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  value={newSpec.description}
                  onChange={(e) => setNewSpec({ ...newSpec, description: e.target.value })}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
