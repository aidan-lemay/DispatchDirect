const express = require('express');
const db = require('../db/db');
const router = express.Router();

// Get All Calls
router.get('/', async (req, res) => {
    db.all('SELECT * FROM calls', (err, rows) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
        } else {
          res.send(rows);
        }
      });
});

// Get Call By Run Number

// Create New Call
router.post('/', async (req, res) => {
    try {
        if (req.body) {
            var { name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes } = req.body;

            name = name.toString();
            phone = phone.toString();
            bib = bib.toString();
            location = location.toString();
            complaint = complaint.toString();
            notes = notes.toString();

            // Validate input before adding to DB - name, phone, bib, location, complaint, and notes are all user-generated.
            if (name.length < 1) {
                res.json({ 'error': 'Name Invalid' });
                res.status(403);
                res.end();
            }
            if (phone.length < 1) {
                res.json({ 'error': 'Phone Number Invalid' });
                res.status(403);
                res.end();
            }
            if (bib.length < 1) {
                res.json({ 'error': 'Bib Number Invalid' });
                res.status(403);
                res.end();
            }
            if (location.length < 1) {
                res.json({ 'error': 'Location Invalid' });
                res.status(403);
                res.end();
            }
            if (complaint.length < 1) {
                res.json({ 'error': 'Complaint Invalid' });
                res.status(403);
                res.end();
            }
            if (notes.length < 1) {
                notes = "";
            }

            // Create auto-generated data before adding to DB
            run_no = "";
            open_time = new Date();
            close_time = "";
            unit = "";
            status = "Unassigned";

            const sql = 'INSERT INTO calls (name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(sql, [ name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes ], function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Internal server error');
                } else {
                    const id = this.lastID;
                    res.status(201).send({ name, phone, bib, location, complaint, run_no, open_time, close_time, unit, status, notes });
                }
            });

        }
        else {
            res.json({ 'error': "missing inputs" });
            res.status(500);
            res.end();
        }
    }
    catch (error) {
        console.error(error);
        res.json({ "error": error });
        res.status(500);
        res.end();
    }
});

// Update Call By Run Number
router.put('/update', async (req, res) => {

});

// Delete Call By Run Number(Remove this call in prod?)

module.exports = router;