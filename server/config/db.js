const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        // Fallback connection attempt for CI environment
        if (process.env.CI) {
            try {
                const fallbackURI = process.env.MONGO_URI.replace('+srv', '');
                const fallbackConn = await mongoose.connect(fallbackURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log(`MongoDB Connected via fallback: ${fallbackConn.connection.host}`);
                return fallbackConn;
            } catch (fallbackErr) {
                console.error(`Fallback connection failed: ${fallbackErr.message}`);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;