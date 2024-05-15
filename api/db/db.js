const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/dispatch.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database "dispatch".');
  cleanDB();
  createUnits();
  createCalls();
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
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        bib INTEGER NOT NULL,
        location VARCHAR(100) NOT NULL,
        complaint VARCHAR(100) NOT NULL,
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

module.exports = db;