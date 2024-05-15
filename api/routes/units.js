const express = require('express');
const router = express.Router();
const db = require('../db/db');

// -------------------- Helper Functions --------------------

// Returns "True" if there is an existing record with these parameters, and "False" if not.
function checkUnique(name, contact) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) AS 'count' FROM units WHERE name = ? AND contact = ?`;
        db.all(sql, [name, contact], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                if (rows[0]['count'] == 0) {
                    resolve(true);
                } else if (rows[0]['count'] > 0) {
                    resolve(false);
                }
            }
        });
    });
}

// -------------------- Route Definitions --------------------

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

            // Ensure each field is defined before converting to string and checking length
            if (name !== undefined && name.length < 1) {
                res.status(400).send({ 'error': 'Unit Identifier Invalid' });
                return;
            }
            if (contact !== undefined && contact.length < 1) {
                res.status(400).send({ 'error': 'Contact Number Invalid' });
                return;
            }

            checkUnique(name, contact)
                .then(isUnique => {
                    // Check to see if name and contact number are unique before adding to DB
                    if (!isUnique) {
                        res.status(400).send({ 'error': 'Unit Exists' });
                        res.end();
                    }
                    else {
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
                })
                .catch(err => {
                    // Handle error
                    console.error("Error:", err);
                });
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