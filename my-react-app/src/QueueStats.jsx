// client/src/components/QueueStats.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function QueueStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queue-stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchQueueStats();
  }, []);

  if (loading) return <p>Loading queue statistics...</p>;
  if (error) return <p>Error fetching queue stats: {error.message}</p>;
  if (!stats) return <p>No queue statistics available.</p>;

  return (
    <div>
      <h2>Queue Statistics</h2>
      <p><strong>Waiting Count:</strong> {stats.waiting_count}</p>
      <p><strong>Longest Wait Time:</strong> {stats.longest_wait_time} minutes</p>
    </div>
  );
}

export default QueueStats;
