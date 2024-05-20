const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/dispatch.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database "dispatch".');

  // DELETE IN PROD
  cleanDB();
  // DELETE IN PROD

  createUnits();
  createCalls();

  // DELETE IN PROD
  loadSampleData();
  // DELETE IN PROD
});

function cleanDB() {
  try {
    db.exec(`
      DROP TABLE IF EXISTS units;
      DROP TABLE IF EXISTS calls;
    `);
    console.log('Database Cleaned Successfully');
  }
  catch (error) {
    console.error(error);
  }
}

function createUnits() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS units (
        unitID INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL,
        contact VARCHAR(100) NOT NULL UNIQUE
      );
    `);
    console.log('Table "units" created successfully');
  }
  catch (error) {
    console.error(error);
  }
}

function createCalls() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS calls (
        callID INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(10) NOT NULL,
        bib VARCHAR(10) NOT NULL,
        location VARCHAR(200) NOT NULL,
        complaint VARCHAR(500) NOT NULL,
        open_time TIMESTAMP NOT NULL,
        close_time TIMESTAMP,
        unit INTEGER,
        status VARCHAR(100) NOT NULL,
        notes VARCHAR(100),
        FOREIGN KEY(unit) REFERENCES units(id)
      );
    `);
    console.log('Table "calls" created successfully');
  }
  catch (error) {
    console.error(error);
  }
}

function loadSampleData() {
  try {
    db.exec(`
    INSERT INTO units (name, status, contact) VALUES ('SAG1', 'Free', '4567894152');
    INSERT INTO units (name, status, contact) VALUES ('SAG2', 'Free', '7891859915');
    INSERT INTO units (name, status, contact) VALUES ('SAG3', 'Free', '4819189489');
    INSERT INTO units (name, status, contact) VALUES ('SAG4', 'Free', '4891981891');
    INSERT INTO units (name, status, contact) VALUES ('MARSHALL1', 'Free', '7489189489');
    INSERT INTO units (name, status, contact) VALUES ('MARSHALL2', 'Free', '7891859289');
    
    INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Joe Rider', '1234567898', '1234', '123 North 12th Street, Cross Street Wilson', 'Flat Tire', '5/15/2024, 5:57:36 PM', '', '', 'Unassigned', '<System>: Very Angry.|');
    INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Jim Passerby', '7895415975', '4891', 'North Main Street and East Ave at the Walmart', 'Rider Down, Unconscious', '5/15/2024, 5:58:23 PM', '', '', 'Unassigned', '<System>: Leaving the scene.|');
    INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Frank Volley', '1891789458', '0000', 'Rest Stop 1', 'Need More Water', '5/15/2024, 6:00:01 PM', '', '', 'Unassigned', '<System>: Last Rider Should Pass Soon.|');
    `);
    console.log('Sample Data Loaded Successfully');
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = db;