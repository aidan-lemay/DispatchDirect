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
            res.status(200).send(rows);
        }
    });
});

// Get Call By Run Number

// Create New Call
router.post('/', async (req, res) => {
    try {
        if (req.body) {
            var { name, phone, bib, location, complaint, open_time, status, notes } = req.body;

            name = name.toString();
            phone = phone.toString();
            bib = bib.toString();
            location = location.toString();
            complaint = complaint.toString();
            notes = notes.toString();

            // Validate input before adding to DB - name, phone, bib, location, complaint, and notes are all user-generated.
            if (name.length < 1) {
                res.status(400).send({ 'error': 'Name Invalid' });
                res.end();
            }
            else if (phone.length < 1) {
                res.status(400).send({ 'error': 'Phone Number Invalid' });
                res.end();
            }
            else if (bib.length < 1) {
                res.status(400).send({ 'error': 'Bib Number Invalid' });
                res.end();
            }
            else if (location.length < 1) {
                res.status(400).send({ 'error': 'Location Invalid' });
                res.end();
            }
            else if (complaint.length < 1) {
                res.status(400).send({ 'error': 'Complaint Invalid' });
                res.end();
            }
            else if (notes.length < 1) {
                notes = "";
            }
            else {
                // Create auto-generated data before adding to DB
                open_time = new Date();
                close_time = "";
                unit = "";
                status = "Unassigned";

                const sql = 'INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                db.run(sql, [name, phone, bib, location, complaint, open_time, close_time, unit, status, notes], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Internal server error');
                        res.end();
                    } else {
                        const callID = this.lastID;
                        res.status(201).send({ callID });
                        res.end();
                    }
                });
            }
        }
        else {
            res.status(400).send({ 'error': 'Missing Data' });
            res.end();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ 'error': error });
        res.end();
    }
});

// Update Call By Run Number
router.put('/update', async (req, res) => {

});

// Delete Call By Run Number(Remove this call in prod?)

module.exports = router;