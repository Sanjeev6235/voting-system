const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get all elections
// @route   GET /api/elections
// @access  Public
const getElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('createdBy', 'name')
      .populate('winner', 'name party')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: elections.length, elections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single election
// @route   GET /api/elections/:id
// @access  Public
const getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('winner', 'name party');
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    res.json({ success: true, election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create election
// @route   POST /api/elections
// @access  Admin
const createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // Auto-set status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let status = 'upcoming';
    if (now >= start && now <= end) status = 'active';
    else if (now > end) status = 'completed';

    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Election created', election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update election
// @route   PUT /api/elections/:id
// @access  Admin
const updateElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    res.json({ success: true, message: 'Election updated', election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete election
// @route   DELETE /api/elections/:id
// @access  Admin
const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });

    // Delete related candidates and votes
    await Candidate.deleteMany({ electionId: req.params.id });
    await Vote.deleteMany({ electionId: req.params.id });
    await election.deleteOne();

    res.json({ success: true, message: 'Election and related data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update election status (admin action)
// @route   PUT /api/elections/:id/status
// @access  Admin
const updateElectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });

    // If completing, calculate winner
    if (status === 'completed') {
      const candidates = await Candidate.find({ electionId: election._id }).sort({ voteCount: -1 });
      if (candidates.length > 0) {
        election.winner = candidates[0]._id;
        await election.save();
      }
    }

    res.json({ success: true, message: `Election status updated to ${status}`, election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getElections, getElection, createElection, updateElection, deleteElection, updateElectionStatus };
