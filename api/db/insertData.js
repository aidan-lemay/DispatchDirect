const db = require("./createTable");

function insertRow() {
  const [name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes] = process.argv.slice(2);

  db.run(
    `INSERT INTO calls (name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes],
    function (error) {
      if (error) {
        console.error(error.message);
      }
      console.log(`Inserted a row with the ID: ${this.lastID}`);
    }
  );
}

insertRow();

// node insertRow.js "Test Name", "Test Phone", "Test Bib", "Test Loc", "Test Complaint", run_no, open_time, close_time, unit, status, notes