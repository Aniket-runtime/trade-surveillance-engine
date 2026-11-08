const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connects to the database using the secret URI from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB successfully connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1); // Shuts down the server if the database fails to connect
    }
};

module.exports = connectDB;