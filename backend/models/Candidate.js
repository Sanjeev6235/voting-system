const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: [true, 'Election ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    party: {
      type: String,
      required: [true, 'Party name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      default: '🗳️',
    },
    photo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
    manifesto: {
      type: String,
      maxlength: [1000, 'Manifesto cannot exceed 1000 characters'],
      default: '',
    },
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
