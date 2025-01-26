import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './Waiting.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AverageRemainingTime from './math/AverageRemainingTime.jsx';
import Divider from '@mui/material/Divider';



function Waiting({ userId }) {

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
        <div className='Waiting'>
        {patient ? (
            <div className="sectionWaiting">
            <h1 className="titre">{patient.status_current_phase}</h1>
            <Divider variant='middle' style={{width:'60vw', margin:0}}/>
            <div className="waitingQueue">
                <p>Your position in the queue is: </p>
                <p className="pos">{patient.queue_position_global}</p>
            </div>
            <div className="onglet">
                <ButtonGroup variant="text" size="large" aria-label="Medium-sized button group">
                    <Button style={{ color: 'green' }} >FAQ</Button>
                </ButtonGroup>
            </div>
            <Divider variant='middle' style={{width:'60vw', margin:0}}/>
            <div className="lastUpdate">
                <p>Your information was updated 1 minute ago.</p>
            </div>
            <div className="timeLeft">
                <AverageRemainingTime triage_category={patient.triage_category} elapsed_time={patient.time_elapsed} />
            </div>
        </div>
        ) : (<div>User not found</div>)}
            
        </div>

    );


};

export default Waiting;