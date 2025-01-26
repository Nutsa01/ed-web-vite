-- db/schema.sql

-- Table to store individual patient information
CREATE TABLE IF NOT EXISTS patients (
    patient_id TEXT PRIMARY KEY,
    arrival_time TEXT,
    triage_category INTEGER,
    queue_position_global INTEGER, -- Allow NULL
    queue_position_category INTEGER, -- Allow NULL
    status_current_phase TEXT,
    labs_status TEXT,
    imaging_status TEXT,
    time_elapsed INTEGER,
    inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table to store queue statistics (optional)
CREATE TABLE IF NOT EXISTS queue_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waiting_count INTEGER,
    longest_wait_time INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
