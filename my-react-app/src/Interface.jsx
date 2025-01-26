// client/src/components/Interface.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Nav from './Nav';

function Interface() { // Changed prop name to camelCase
    const { id } = useParams(); 
const [patient, setPatient] = useState(null); // Assuming fetching a single patient
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Removed colon before userId
        const response = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Only fetch if userId is provided
    if (id) {
      fetchPatient();
    } else {
      setLoading(false);
      setError(new Error('No user ID provided'));
    }
  }, [id]); // Added userId as a dependency

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>Error fetching patient data: {error.message}</p>;

  return (
    <>
      <Nav userId={id} />

    </>
  );
}

export default Interface;
