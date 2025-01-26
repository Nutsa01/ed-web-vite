// client/src/components/PatientsList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queue');
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>Error fetching patients: {error.message}</p>;

  return (
    <div>
      <h1>Patients List</h1>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.patient_id} style={{ marginBottom: '1em' }}>
              <p><strong>ID:</strong> {patient.patient_id}</p>
              <p><strong>Arrival Time:</strong> {new Date(patient.arrival_time).toLocaleString()}</p>
              <p><strong>Triage Category:</strong> {patient.triage_category}</p>
              {patient.status_current_phase === 'Waiting' && (
                <>
                  <p><strong>Queue Position (Global):</strong> {patient.queue_position_global}</p>
                  <p><strong>Queue Position (Category):</strong> {patient.queue_position_category}</p>
                </>
              )}
              <p><strong>Current Phase:</strong> {patient.status_current_phase}</p>
              {patient.status_current_phase !== 'Waiting' && (
                <>
                  <p><strong>Labs Status:</strong> {patient.labs_status || 'N/A'}</p>
                  <p><strong>Imaging Status:</strong> {patient.imaging_status || 'N/A'}</p>
                </>
              )}
              <p><strong>Time Elapsed:</strong> {patient.time_elapsed} minutes</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientsList;
