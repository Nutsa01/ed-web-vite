// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'db', 'patients.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// API Endpoints

/**
 * GET /api/patients
 * Retrieves all patients from the database.
 */
app.get('/api/patients', (req, res) => {
  const query = `SELECT * FROM patients ORDER BY datetime(arrival_time) DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching patients:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
app.get('/api/queue', (req, res) => { // Added leading slash
    const query = `SELECT * FROM patients WHERE status_current_phase = 'Waiting'`;
    
    db.all(query, [], (err, rows) => { // Changed from db.get to db.all
        if (err) {
            console.error('Error fetching queue:', err.message);
            res.status(500).json({ error: err.message }); // Added dot
            return;
        }

        res.json(rows); // Return all matching rows
    });
});

/**
 * GET /api/patients/:id
 * Retrieves a specific patient by their ID.
 */
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM patients WHERE patient_id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(`Error fetching patient with ID ${id}:`, err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json(row);
  });
});

/**
 * GET /api/queue-stats
 * Retrieves the latest queue statistics.
 */
app.get('/api/queue-stats', (req, res) => {
  const query = `SELECT * FROM queue_stats ORDER BY created_at DESC LIMIT 1`;
  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Error fetching queue statistics:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});




// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
