const express = require('express');
const app = express();
const connectDB = require('./config/db');
require('dotenv').config(); // Activates the .env vault
const PORT = 3000;
const tradeRoutes = require('./routes/tradeRoutes');
const cors = require('cors');
app.use(cors()); // Opens the backend to frontend requests

// Middleware: Instructs Express to parse incoming JSON payloads (our trade data)
app.use(express.json());
// Execute the database connection
// Mount the trade routes to the '/api/trades' URL path
app.use('/api/trades', tradeRoutes);
connectDB();

// A simple GET Route to test the connection
app.get('/', (req, res) => {
    res.status(200).json({ message: "Trade Surveillance API is running securely." });
});

// Boot up the server
app.listen(PORT, () => {
    console.log(`Server is actively listening on port ${PORT}`);
});