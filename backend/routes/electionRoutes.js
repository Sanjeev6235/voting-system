const express = require('express');
const { getElections, getElection, createElection, updateElection, deleteElection, updateElectionStatus } = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getElections);
router.get('/:id', getElection);
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.put('/:id/status', protect, adminOnly, updateElectionStatus);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;
