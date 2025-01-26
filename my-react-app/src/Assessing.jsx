import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './Assessing.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AverageRemainingTime from './math/AverageRemainingTime.jsx';


function Assessing({ userId }) {

  const [patient, setPatient] = useState(null); // Assuming fetching a single patient
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Removed colon before userId
        const response = await axios.get(`http://localhost:5000/api/patients/${userId}`);
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Only fetch if userId is provided
    if (userId) {
      fetchPatient();
    } else {
      setLoading(false);
      setError(new Error('No user ID provided'));
    }
  }, [userId]); // Added userId as a dependency

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>Error fetching patient data: {error.message}</p>;



    return (
        <>
        {patient ? (
            <div className="sectionWaiting">
            <h1 className="titre">{patient.status_current_phase}</h1>
            <div className="waitingQueue">
                <p>Your position in the queue is: </p>
                <h3 className="pos">{patient.queue_position_global}</h3>
            </div>
            <div className="onglet">
                <ButtonGroup variant="text" size="large" aria-label="Medium-sized button group">
                    <Button>FAQ</Button>
                </ButtonGroup>
            </div>
            <div className="lastUpdate">
                <p>Your information was updated 1 minute ago.</p>
            </div>
            <div className="timeLeft">
                <AverageRemainingTime triage_category={patient.triage_category} elapsed_time={patient.time_elapsed} />
            </div>
        </div>
        ) : (<div>User not found</div>)}
            
        </>

    );


};

export default Assessing;