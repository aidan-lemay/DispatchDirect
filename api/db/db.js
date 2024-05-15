const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./dispatch.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database "dispatch".');
  createCalls();
  createUnits();
});

function createCalls() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_no VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        bib INTEGER NOT NULL,
        location VARCHAR(100) NOT NULL,
        complaint VARCHAR(100) NOT NULL,
        open_time TIMESTAMP NOT NULL,
        close_time TIMESTAMP,
        unit VARCHAR(100) NOT NULL,
        status VARCHAR(100) NOT NULL,
        notes VARCHAR(100)
      );
    `);
    console.log('Table "calls" created successfully');
  }
  catch (error) {
    console.error(error);
  }
}

function createUnits() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS units (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        contact VARCHAR(100) NOT NULL
      );
    `);
    console.log('Table "units" created successfully');
  }
  catch (error) {
    console.error(error);
  }
}



module.exports = db;