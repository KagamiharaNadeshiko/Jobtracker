const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load Config
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./server/routes/users'));
app.use('/api/industries', require('./server/routes/industries'));
app.use('/api/companies', require('./server/routes/companies'));
app.use('/api/positions', require('./server/routes/positions'));
app.use('/api/essays', require('./server/routes/essays'));
app.use('/api/online-tests', require('./server/routes/onlinetests'));
app.use('/api/interviews', require('./server/routes/interviews'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to Jobtracing API' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// For testing purposes
module.exports = app;