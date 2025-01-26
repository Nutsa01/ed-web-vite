import "./Reviewing.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Divider from "@mui/material/Divider";
import ScienceIcon from "@mui/icons-material/Science";
import ImageIcon from "@mui/icons-material/Image";


function Reviewing({ userId }) {
  const [patient, setPatient] = useState(null); // Assuming fetching a single patient
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Removed colon before userId
        const response = await axios.get(
          `http://localhost:5000/api/patients/${userId}`
        );
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
      setError(new Error("No user ID provided"));
    }
  }, [userId]); // Added userId as a dependency

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>Error fetching patient data: {error.message}</p>;

  return (
    <div className="Reviewing">
      {patient ? (
        <div className="section">
          <h1 className="titre">{patient.status_current_phase}</h1>
          <Divider variant="middle" style={{ width: "60vw", margin: 0 }} />
          <div className="queue">
            <h2>We are analysing potential causes</h2>
            <div className="annexes">
              <div className="annex-stat">
                <p>Laboratory Status</p>
                <ScienceIcon style={{ color: "green", fontSize: "3rem" }} />
                <p>{patient.labs_status}</p>
              </div>
              <div className="annex-stat">
                <p>Imaging Status</p>
                <ImageIcon style={{ color: "green", fontSize: "3rem" }} />
                <p>{patient.imaging_status}</p>
              </div>
            </div>
          </div>
          <Divider variant="middle" style={{ width: "60vw", margin: '2rem' }} />
          <div className="lastUpdate">
            <p>Your information was updated 1 minute ago.</p>
          </div>
        </div>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
}

export default Reviewing;
