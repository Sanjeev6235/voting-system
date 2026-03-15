const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private (Voter)
const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    // Check election exists and is active
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    if (election.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Voting is not open for this election' });
    }

    // Check candidate belongs to this election
    const candidate = await Candidate.findOne({ _id: candidateId, electionId });
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found in this election' });

    // Check if voter already voted in this election
    const existingVote = await Vote.findOne({ voterId, electionId });
    if (existingVote) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }

    // Record vote
    const vote = await Vote.create({ voterId, electionId, candidateId });

    // Update candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    // Update election total votes
    await Election.findByIdAndUpdate(electionId, { $inc: { totalVotes: 1 } });

    // Mark user as voted in this election
    await User.findByIdAndUpdate(voterId, { $addToSet: { votedElections: electionId } });

    res.status(201).json({ success: true, message: 'Vote cast successfully!', vote });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if user voted in an election
// @route   GET /api/votes/check/:electionId
// @access  Private
const checkVoteStatus = async (req, res) => {
  try {
    const vote = await Vote.findOne({ voterId: req.user._id, electionId: req.params.electionId }).populate('candidateId', 'name party');
    res.json({ success: true, hasVoted: !!vote, vote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { castVote, checkVoteStatus };
