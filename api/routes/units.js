const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3');

router.get('/', async (req, res) => {
    res.send("Success")
});

module.exports = router;