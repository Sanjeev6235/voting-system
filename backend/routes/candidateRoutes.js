const express = require('express');
const { getCandidates, getCandidate, createCandidate, updateCandidate, deleteCandidate } = require('../controllers/candidateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:electionId', getCandidates);
router.get('/single/:id', getCandidate);
router.post('/', protect, adminOnly, createCandidate);
router.put('/:id', protect, adminOnly, updateCandidate);
router.delete('/:id', protect, adminOnly, deleteCandidate);

module.exports = router;
