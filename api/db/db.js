const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./dispatch.db', (err) => {
    createTable();
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the dispatch database.');
});

function createTable(db) {
    db.exec(`
    CREATE TABLE calls
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_no VARCHAR(50) NOT NULL,
      name   VARCHAR(50) NOT NULL,
      phone   VARCHAR(50) NOT NULL,
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
}

module.exports = db;