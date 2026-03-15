// Run: node seed.js
// Seeds an admin user and sample election data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Election.deleteMany({});
  await Candidate.deleteMany({});
  console.log('Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@vote.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create voters
  const voter1 = await User.create({ name: 'Alice Johnson', email: 'alice@vote.com', password: 'voter123', role: 'voter' });
  const voter2 = await User.create({ name: 'Bob Smith', email: 'bob@vote.com', password: 'voter123', role: 'voter' });

  // Create election
  const now = new Date();
  const election = await Election.create({
    title: 'Student Council President Election 2025',
    description: 'Annual election for Student Council President. All registered students are eligible to vote.',
    startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    createdBy: admin._id,
  });

  // Create candidates
  await Candidate.insertMany([
    { electionId: election._id, name: 'Priya Sharma', party: 'Progress Alliance', symbol: '🌟', description: 'Dedicated to student welfare and campus improvements.', manifesto: 'My vision is a campus where every student thrives. I will focus on better facilities, mental health support, and academic resources.', voteCount: 12 },
    { electionId: election._id, name: 'Rahul Verma', party: 'United Students Front', symbol: '🦅', description: 'Champion of innovation and academic excellence.', manifesto: 'I stand for transparency in student governance, more industry partnerships, and a stronger placement cell.', voteCount: 8 },
    { electionId: election._id, name: 'Sneha Patel', party: 'Campus First Party', symbol: '🌿', description: 'Advocate for sustainability and student rights.', manifesto: 'Green campus initiative, zero-waste cafeteria, and 24/7 library access are my top priorities.', voteCount: 5 },
  ]);

  // Upcoming election
  await Election.create({
    title: 'Class Representative Elections',
    description: 'Elect class representatives for the upcoming academic year.',
    startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    createdBy: admin._id,
  });

  console.log('\n✅ Seed data created successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin Login:  admin@vote.com / admin123');
  console.log('Voter Login:  alice@vote.com / voter123');
  console.log('              bob@vote.com   / voter123');
  console.log('─────────────────────────────────');
  process.exit();
};

seed().catch((err) => { console.error(err); process.exit(1); });
