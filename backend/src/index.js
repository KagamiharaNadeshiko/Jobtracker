require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const industryRoutes = require('./routes/industry');
const companyRoutes = require('./routes/company');
const positionRoutes = require('./routes/position');
const interviewRoutes = require('./routes/interview');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/interviews', interviewRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Job Application Tracking API is running');
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, async() => {
    console.log(`Server running on port ${PORT}`);

    try {
        await sequelize.authenticate();
        console.log('Database connection established');
        // For development, sync database (not for production)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synced');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});