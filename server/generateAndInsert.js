// generateAndInsert.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// === Updated Mock Data Generation Code ===

// Define the new Patient Phases
const PatientPhase = {
  WAITING: "Waiting",
  ASSESSING: "Assessing",
  INVESTIGATING: "Investigating",
  REVIEWING: "Reviewing",
  DISCHARGED: "Discharged"
};

// Define the new Investigation States
const InvestigationState = {
  ORDERED: "Ordered",
  PENDING: "Pending",
  DONE: "Done"
};

// Triage Categories remain the same
const TriageCategory = {
  RESUSCITATION: 1,
  EMERGENT: 2,
  URGENT: 3,
  LESS_URGENT: 4,
  NON_URGENT: 5
};

// Function to generate a mock patient ID
const generateMockPatientId = () => 
  `anon_${Math.floor(Math.random() * 9000) + 1000}`;

// Function to generate a mock triage category based on realistic distributions
const generateMockTriageCategory = () => {
  const roll = Math.random() * 100;
  if (roll < 1) return TriageCategory.RESUSCITATION;
  if (roll < 16) return TriageCategory.EMERGENT;
  if (roll < 61) return TriageCategory.URGENT;
  if (roll < 91) return TriageCategory.LESS_URGENT;
  return TriageCategory.NON_URGENT;
};

// Function to generate a mock wait time based on triage category
const generateMockWaitTime = (triageCategory) => {
  const waitRanges = {
    [TriageCategory.RESUSCITATION]: [0, 5],
    [TriageCategory.EMERGENT]: [15, 30],
    [TriageCategory.URGENT]: [30, 120],
    [TriageCategory.LESS_URGENT]: [60, 240],
    [TriageCategory.NON_URGENT]: [120, 360]
  };
  const [min, max] = waitRanges[triageCategory];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a mock patient status based on current phase
const generateMockPatientStatus = () => {
  const phases = Object.values(PatientPhase);
  const phase = phases[Math.floor(Math.random() * phases.length)];
  
  const status = { current_phase: phase };

  if (phase === PatientPhase.WAITING) {
    // In 'Waiting' phase, queue_position is applicable
    // No need to modify status further
    return status;
  }

  if (phase === PatientPhase.ASSESSING || phase === PatientPhase.REVIEWING) {
    // These phases might have some investigation statuses
    status.investigations = {
      labs: Math.random() < 0.5 ? InvestigationState.ORDERED : InvestigationState.PENDING,
      imaging: Math.random() < 0.5 ? InvestigationState.ORDERED : InvestigationState.PENDING
    };
    return status;
  }

  if (phase === PatientPhase.INVESTIGATING) {
    // In 'Investigating' phase, some investigations might be pending or done
    status.investigations = {
      labs: Math.random() < 0.5 ? InvestigationState.PENDING : InvestigationState.DONE,
      imaging: Math.random() < 0.5 ? InvestigationState.PENDING : InvestigationState.DONE
    };
    return status;
  }

  if (phase === PatientPhase.DISCHARGED) {
    // In 'Discharged' phase, investigations are done
    status.investigations = {
      labs: InvestigationState.DONE,
      imaging: InvestigationState.DONE
    };
    return status;
  }

  return status;
};

// Function to generate mock queue position
const generateMockQueuePosition = () => ({
  global: Math.floor(Math.random() * 25) + 1,
  category: Math.floor(Math.random() * 5) + 1
});

// Function to generate a mock patient with overrides
const generateMockPatient = (overrides = {}) => {
  const triageCategory = overrides.triageCategory || generateMockTriageCategory();
  const timeElapsed = overrides.timeElapsed || generateMockWaitTime(triageCategory);
  const arrivalTime = overrides.arrivalTime || new Date(Date.now() - timeElapsed * 60000);

  // Generate status
  const status = overrides.status || generateMockPatientStatus();

  // Determine if queue_position should be null
  const isWaiting = status.current_phase === PatientPhase.WAITING;

  return {
    id: overrides.id || generateMockPatientId(),
    arrival_time: arrivalTime.toISOString(),
    triage_category: triageCategory,
    queue_position: isWaiting ? generateMockQueuePosition() : null,
    status: status,
    time_elapsed: timeElapsed
  };
};

// === End of Mock Data Generation Code ===

// Number of mock patients to generate
const NUM_PATIENTS = 100;

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'db', 'patients.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Function to insert a patient into the database
const insertPatient = (patient) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO patients (
        patient_id,
        arrival_time,
        triage_category,
        queue_position_global,
        queue_position_category,
        status_current_phase,
        labs_status,
        imaging_status,
        time_elapsed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      patient.id,
      patient.arrival_time,
      patient.triage_category,
      patient.queue_position ? patient.queue_position.global : null,
      patient.queue_position ? patient.queue_position.category : null,
      patient.status.current_phase,
      patient.status.investigations ? patient.status.investigations.labs : null,
      patient.status.investigations ? patient.status.investigations.imaging : null,
      patient.time_elapsed
    ];

    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

// Function to insert queue stats (optional)
const insertQueueStats = (waitingCount, longestWaitTime) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO queue_stats (
        waiting_count,
        longest_wait_time
      ) VALUES (?, ?)
    `;
    const params = [waitingCount, longestWaitTime];
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

// Main function to generate and insert patients
const populateDatabase = async () => {
  try {
    // Begin transaction for faster inserts
    db.run('BEGIN TRANSACTION');

    let maxWaitTime = 0;

    for (let i = 0; i < NUM_PATIENTS; i++) {
      const patient = generateMockPatient();

      // Update maxWaitTime if necessary
      if (patient.time_elapsed > maxWaitTime) {
        maxWaitTime = patient.time_elapsed;
      }

      await insertPatient(patient);
      if ((i + 1) % 10 === 0) {
        console.log(`${i + 1} patients inserted...`);
      }
    }

    // Insert queue stats (optional)
    const waitingCount = await new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) as count FROM patients WHERE status_current_phase = ?`;
      db.get(query, [PatientPhase.WAITING], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });

    await insertQueueStats(waitingCount, maxWaitTime);
    console.log('Queue statistics inserted.');

    // Commit transaction
    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Error committing transaction:', err.message);
        db.run('ROLLBACK');
      } else {
        console.log(`Successfully inserted ${NUM_PATIENTS} mock patients and queue stats.`);
      }
      db.close();
    });

  } catch (error) {
    console.error('Error inserting patients:', error.message);
    db.run('ROLLBACK');
    db.close();
  }
};

// Execute the population
populateDatabase();
