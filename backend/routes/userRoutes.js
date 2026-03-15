const express = require('express');
const { getProfile, updateProfile, changePassword, getAllVoters, deleteVoter } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/voters', protect, adminOnly, getAllVoters);
router.delete('/:id', protect, adminOnly, deleteVoter);

module.exports = router;
