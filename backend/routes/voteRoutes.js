const express = require('express');
const { castVote, checkVoteStatus } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, castVote);
router.get('/check/:electionId', protect, checkVoteStatus);

module.exports = router;
