const express = require('express');

const app = express();
app.use(express.json());

const calls = require('./routes/calls.js');
const units = require('./routes/units.js');

app.use('/api/calls', calls);
app.use('/api/units', units);

app.listen(3000, () => {
    console.info("App listening");
});