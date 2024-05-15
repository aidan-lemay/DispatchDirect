const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get All Units
router.get('/', async (req, res) => {
    db.all('SELECT * FROM units', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send(rows);
        }
    });
});

// Create New Unit
router.post('/', async (req, res) => {
    try {
        if (req.body) {
            var { name, contact } = req.body;

            name = name.toString();
            contact = contact.toString();

            // Check to see if name and contact number are unique before adding to DB

            // Validate input before adding to DB - name and contact are all user-generated.
            if (name.length < 1) {
                res.status(400).send({ 'error': 'Name Invalid' });
                res.end();
            }
            else if (contact.length < 1) {
                res.status(400).send({ 'error': 'Contact Number Invalid' });
                res.end();
            }
            else {
                // Create auto-generated data before adding to DB
                var status = "Unassigned";

                const sql = 'INSERT INTO units (name, contact, status) VALUES (?, ?, ?)';
                db.run(sql, [name, contact, status], function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Internal server error');
                        res.end();
                    } else {
                        const unitID = this.lastID;
                        res.status(201).send({ unitID });
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

module.exports = router;