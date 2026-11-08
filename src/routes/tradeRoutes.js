const express = require('express');
const router = express.Router();

// 1. Import all three controller functions
const { createTrade, getTrades, flagTrade } = require('../controllers/tradeController');

// 2. Bind the network methods
router.post('/', createTrade); // Log a new trade
router.get('/', getTrades);    // Fetch all trades

// 3. Bind a PATCH request to specifically update the flagged status
// The ':id' acts as a dynamic variable in the URL
router.patch('/:id/flag', flagTrade); 

module.exports = router;