const express = require('express');
const { getResults, getDashboardStats } = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats/dashboard', protect, adminOnly, getDashboardStats);
router.get('/:electionId', getResults);

module.exports = router;
