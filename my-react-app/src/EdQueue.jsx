import React, { useEffect, useState } from "react";

function EdQueue() {
  // State to store the queue data
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your actual base URL + /queue
    // e.g. fetch("http://localhost:3000/api/v1/queue")
    fetch("https://ifem-award-mchacks-2025.onrender.com/api/v1/queue")
      .then((response) => response.json())
      .then((data) => {
        setQueueData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ED queue data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading ED Queue...</div>;
  }

  if (!queueData) {
    return <div>No data to display</div>;
  }

  const { waitingCount, longestWaitTime, patients } = queueData;

  return (
    <div>
      <h1>Emergency Department Queue</h1>
      <p>Waiting Count: {waitingCount}</p>
      <p>Longest Wait Time (min): {longestWaitTime}</p>

      <h2>Patients</h2>
      {patients.map((patient) => (
        <div key={patient.id} style={{ marginBottom: "1em" }}>
          <p>ID: {patient.id}</p>
          <p>Arrival Time: {patient.arrival_time}</p>
          <p>Triage Category: {patient.triage_category}</p>
          <p>
            Queue Position (Global: {patient.queue_position.global}, Category:{" "}
            {patient.queue_position.category})
          </p>
          <p>Current Phase: {patient.status.current_phase}</p>
          <p>Time Elapsed: {patient.time_elapsed} minutes</p>
        </div>
      ))}
    </div>
  );
}

export default EdQueue;
