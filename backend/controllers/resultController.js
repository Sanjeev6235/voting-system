const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get election results
// @route   GET /api/results/:electionId
// @access  Public
const getResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId).populate('winner', 'name party symbol');
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });

    const candidates = await Candidate.find({ electionId: req.params.electionId }).sort({ voteCount: -1 });

    const totalVotes = election.totalVotes;
    const resultsWithPercentage = candidates.map((c) => ({
      _id: c._id,
      name: c.name,
      party: c.party,
      symbol: c.symbol,
      photo: c.photo,
      voteCount: c.voteCount,
      percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : '0.0',
    }));

    res.json({
      success: true,
      election: {
        _id: election._id,
        title: election.title,
        status: election.status,
        totalVotes,
        winner: election.winner,
      },
      results: resultsWithPercentage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/results/stats/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalElections = await Election.countDocuments();
    const activeElections = await Election.countDocuments({ status: 'active' });
    const completedElections = await Election.countDocuments({ status: 'completed' });
    const upcomingElections = await Election.countDocuments({ status: 'upcoming' });
    const totalVotes = await Vote.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    const User = require('../models/User');
    const totalVoters = await User.countDocuments({ role: 'voter' });

    res.json({
      success: true,
      stats: {
        totalElections,
        activeElections,
        completedElections,
        upcomingElections,
        totalVotes,
        totalCandidates,
        totalVoters,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResults, getDashboardStats };
