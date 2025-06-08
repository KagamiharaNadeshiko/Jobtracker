/**
 * MongoDB Connection Preparation Script
 * 
 * This script handles MongoDB connection issues in CI environments
 * by providing fallback mechanisms for DNS resolution problems.
 */

const mongoose = require('mongoose');

/**
 * Attempts to connect to MongoDB with fallback options
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise} - Resolves with connection or rejects with error
 */
async function connectWithFallback(uri) {
    try {
        console.log('Attempting primary connection to MongoDB...');
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`Primary connection failed: ${err.message}`);

        // If in CI environment, try fallback connection
        if (process.env.CI) {
            console.log('Detected CI environment, attempting fallback connection...');
            try {
                // Remove +srv if present to force direct connection
                const fallbackUri = uri.replace('+srv', '');
                console.log('Using fallback URI (without SRV)');

                const fallbackConn = await mongoose.connect(fallbackUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log(`MongoDB Connected via fallback: ${fallbackConn.connection.host}`);
                return fallbackConn;
            } catch (fallbackErr) {
                console.error(`Fallback connection failed: ${fallbackErr.message}`);
                throw fallbackErr;
            }
        } else {
            throw err;
        }
    }
}

module.exports = connectWithFallback;