// client/src/components/Interface.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Waiting from './Waiting.jsx';
import Assessing from './Assessing.jsx';
import Investigating from './Investigating.jsx';
import Reviewing from './Reviewing.jsx';
import Discharged from './Discharged.jsx';
import EmergencySteps from './EmergencySteps.jsx';
import './Interface.scss'

function Interface() {
  const { id } = useParams(); // Extract the 'id' from the URL
  const [status, setStatus] = useState(null); // To store the user's status
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${id}`); // Fetch user data by ID
        setStatus(response.data.status_current_phase); // Assuming status is in `status_current_phase`
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Conditional rendering based on the status
  return (
    <div className='Interface'>
      <EmergencySteps status={status} />
      {status === 'Waiting' && <Waiting userId={id} />}
      {status === 'Assessing' && <Assessing userId={id} />}
      {status === 'Investigating' && <Investigating userId={id} />}
      {status === 'Reviewing' && <Reviewing userId={id} />}
      {status === 'Discharged' && <Discharged userId={id} />}
      {!status && <p>Status unknown.</p>} {/* Fallback for unknown status */}
    </div>
  );
}

export default Interface;
