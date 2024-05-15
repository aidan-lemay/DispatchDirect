const express = require('express');
const db = require('../db/db');
const router = express.Router();

// -------------------- Helper Functions --------------------

// Check Unit Status, returns "True" if unit is free or "False" if unit is busy
function checkUnitStatus(unitID) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT status FROM units WHERE unitID = ?`;
        db.all(sql, [unitID], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                if (rows[0]['status'] == "Unassigned") {
                    resolve(true);
                } else if (rows[0]['status'] == "Busy") {
                    resolve(false);
                }
            }
        });
    });
}

// Validate CallID
function checkCallID(callID) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT COUNT(*) as "count" FROM calls WHERE callID = ?`;
        db.all(sql, [callID], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                if (rows[0]['count'] == 1) {
                    resolve(true);
                } else if (rows[0]['count'] == 0) {
                    resolve(false);
                }
            }
        });
    });
}

// Get UnitID By CallID
function unitFromCall(callID) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT unit FROM calls WHERE callID = ?`;
        db.all(sql, [callID], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0]['unit']);
            }
        });
    });
}

// -------------------- Route Definitions --------------------

// Get Calls
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

// Assign Unit By Call ID
router.put('/unit', async (req, res) => {
    try {
        if (req.body) {
            var { callID, unitID } = req.body;

            // Validate CallID
            checkCallID(callID)
                .then(exists => {
                    if (exists) {
                        // Verify Unit Is Free
                        checkUnitStatus(unitID)
                            .then(isFree => {
                                if (!isFree) {
                                    res.status(400).send({ 'error': 'Unit Busy' });
                                    res.end();
                                }
                                else {
                                    // Set Unit To Busy
                                    const sql = 'UPDATE units SET status = "Busy" WHERE unitID = ?';
                                    db.run(sql, [unitID], function (err) {
                                        if (err) {
                                            console.error(err.message);
                                            res.status(500).send('Internal server error');
                                            res.end();
                                        } else {
                                            const sql = 'UPDATE calls SET unit = ?, status = "In-Progress" WHERE callID = ?';
                                            db.run(sql, [unitID, callID], function (err) {
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
                                    });
                                }
                            })
                            .catch(err => {
                                // Handle error
                                console.error("Error:", err);
                            });
                    }
                    else {
                        res.status(400).send({ 'error': 'Call Does Not Exist' });
                        res.end();
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

// Close Call By ID
router.put('/close', async (req, res) => {
    try {
        if (req.body) {
            var { callID } = req.body;

            // Validate CallID
            checkCallID(callID)
                .then(exists => {
                    if (exists) {
                        // Generate Data
                        var close_time = new Date();

                        const sql = 'UPDATE calls SET close_time = ?, status = "Closed" WHERE callID = ?';
                        db.run(sql, [close_time, callID], function (err) {
                            if (err) {
                                console.error(err.message);
                                res.status(500).send('Internal server error');
                                res.end();
                            } else {
                                // Get UnitID From CallID
                                unitFromCall(callID)
                                    .then(unitID => {
                                        if (unitID) {
                                            // Set Unit To Free
                                            const sql = 'UPDATE units SET status = "Free" WHERE unitID = ?';
                                            db.run(sql, [unitID], function (err) {
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
                                        else {
                                            res.status(201).send({ callID });
                                            res.end();
                                        }
                                    })
                                    .catch(err => {
                                        // Handle error
                                        console.error("Error:", err);
                                    });
                            }
                        });

                    }
                    else {
                        res.status(400).send({ 'error': 'Call Does Not Exist' });
                        res.end();
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