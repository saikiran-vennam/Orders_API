const express = require('express');
const app = express();


// Import routes
const blogRoute = require('./routes/main');


//Router MIddlewares
app.use(express.json());
app.use('/', blogRoute);

module.exports = app;
