// setupDatabase.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to the SQLite database file
const dbPath = path.resolve(__dirname, 'db', 'patients.db');

// Read the schema file
const schemaPath = path.resolve(__dirname, 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Connect to SQLite database (it will create the file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Execute the schema SQL to create tables
db.exec(schema, (err) => {
    if (err) {
        console.error('Error executing schema:', err.message);
        process.exit(1);
    }
    console.log('Database schema created successfully.');
    db.close();
});
