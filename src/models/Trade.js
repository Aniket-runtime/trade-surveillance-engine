const mongoose = require('mongoose');

// Define the structural blueprint for a Trade log
const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: String,
        required: true,
        unique: true // Prevents duplicate trade entries
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true // Automatically converts 'aapl' to 'AAPL'
    },
    price: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically stamps the exact millisecond the trade arrives
    },
    isFlagged: {
        type: Boolean,
        default: false // Your PostMortemAI agent will flip this to true if it detects spoofing
    }
});

// Compile the schema into a model and export it
module.exports = mongoose.model('Trade', tradeSchema);

