// 1. Import the Trade model (your database gatekeeper)
const Trade = require('../models/Trade');

// 2. Define the logic to receive and save a trade
const createTrade = async (req, res) => {
    try {
        // Extract the JSON payload sent by the mock exchange. 
        // (This is only readable because of the app.use(express.json()) middleware in server.js)
        const tradeData = req.body;

        // Command the model to validate the data against your schema and insert it into MongoDB
        const newTrade = await Trade.create(tradeData);

        // Send a '201 Created' HTTP status and the saved data back to whoever sent it
        res.status(201).json({
            success: true,
            message: "Trade securely logged in the surveillance database.",
            data: newTrade
        });

    } catch (error) {
        // If Mongoose blocks the insertion (e.g., missing price), the code instantly jumps here
        console.error(`Trade rejection: ${error.message}`);
        res.status(400).json({
            success: false,
            message: "Invalid trade format.",
            error: error.message
        });
    }
};

// 3. Package the function so the Route file can use it
module.exports = { createTrade };

// 3. Define the logic to fetch all trades for PostMortemAI analysis
const getTrades = async (req, res) => {
    try {
        // Command the model to find all records in the trades collection
        const trades = await Trade.find();
        
        // Send a '200 OK' HTTP status and the array of data back to the client
        res.status(200).json({
            success: true,
            count: trades.length,
            data: trades
        });
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 4. Update the export to include both functions
module.exports = { createTrade, getTrades };


// 5. Define the logic for PostMortemAI to flag anomalous trades
const flagTrade = async (req, res) => {
    try {
        // Extract the specific _id from the URL path
        const { id } = req.params; 
        
        // Command the model to find this specific trade and update its flagged status
        const updatedTrade = await Trade.findByIdAndUpdate(
            id,
            { isFlagged: true },
            { new: true } // Instructs Mongoose to return the updated record, not the old one
        );

        // If the ID doesn't exist in the database, return a 404 Not Found error
        if (!updatedTrade) {
            return res.status(404).json({ success: false, message: "Trade not found in surveillance logs." });
        }

        // Return the successfully flagged trade
        res.status(200).json({
            success: true,
            message: "Anomaly detected. Trade flagged for spoofing investigation.",
            data: updatedTrade
        });
    } catch (error) {
        console.error(`Flagging error: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 6. Update the export to include all three functions
module.exports = { createTrade, getTrades, flagTrade };