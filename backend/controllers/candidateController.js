const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// @desc    Get candidates for an election
// @route   GET /api/candidates/:electionId
// @access  Public
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId }).sort({ name: 1 });
    res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/single/:id
// @access  Public
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('electionId', 'title status');
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add candidate
// @route   POST /api/candidates
// @access  Admin
const createCandidate = async (req, res) => {
  try {
    const { electionId, name, party, symbol, photo, description, manifesto } = req.body;

    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });

    const candidate = await Candidate.create({ electionId, name, party, symbol, photo, description, manifesto });
    res.status(201).json({ success: true, message: 'Candidate added', candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Admin
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    res.json({ success: true, message: 'Candidate updated', candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Admin
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });
    await candidate.deleteOne();
    res.json({ success: true, message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCandidates, getCandidate, createCandidate, updateCandidate, deleteCandidate };
