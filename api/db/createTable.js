const sqlite3 = require("sqlite3").verbose();
const filepath = "./dispatch.db";
const fs = require("fs");

function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath);
    } else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            createTable(db);
        });
        console.log("Connection with SQLite has been established");
        return db;
    }
}

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

module.exports = createDbConnection();