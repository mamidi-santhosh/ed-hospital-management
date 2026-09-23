import React, { useEffect, useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import api from '../services/api';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Patient Directory</h2>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age / Gender</th>
              <th>Blood Group</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: '600' }}>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{`${patient.age} yrs / ${patient.gender}`}</td>
                  <td>
                    <span style={{ backgroundColor: '#ffe4e6', color: '#e11d48', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '12px' }}>
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td>{patient.address || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
