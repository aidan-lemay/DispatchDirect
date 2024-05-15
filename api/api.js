const express = require('express');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const calls = require('./routes/calls.js');
const units = require('./routes/units.js');

app.use('/api/calls', calls);
app.use('/api/units', units);

app.listen(3000, () => {
    console.info("App listening on Port 3000");
});