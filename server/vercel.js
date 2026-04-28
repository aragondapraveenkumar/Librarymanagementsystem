const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));
app.use('/api/library', require('./routes/library'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGODB_URI or MONGO_URI is missing. Add your MongoDB Atlas URI in Vercel environment variables.');
}

let connectionPromise;
let seedPromise;

async function seedDatabase() {
  const User = require('./models/User');
  const Book = require('./models/Book');

  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { name: 'System Administrator', username: 'admin', email: 'admin@vemu.edu', password: 'admin123', role: 'Admin', rollno: 'ADM001', isDefault: true },
      { name: 'Librarian In-charge', username: 'librarian', email: 'librarian@vemu.edu', password: 'lib123', role: 'Librarian', rollno: 'LIB001', isDefault: true },
      { name: 'Rahul Sharma', username: 'student1', email: 'student1@vemu.edu', password: 'stud123', role: 'Student', rollno: '21BCS001' },
      { name: 'Dr. Priya Mehta', username: 'faculty1', email: 'faculty1@vemu.edu', password: 'fac123', role: 'Faculty', rollno: 'FAC001' },
    ]);
  }

  const bCount = await Book.countDocuments();
  if (bCount === 0) {
    await Book.create([
      { title: 'Introduction to Algorithms', author: 'Cormen et al.', edition: '4th', subject: 'Computer Science', isbn: '978-0262046305', totalCopies: 8, availableCopies: 6 },
      { title: 'Database System Concepts', author: 'Silberschatz', edition: '7th', subject: 'Database', isbn: '978-1260084504', totalCopies: 5, availableCopies: 3 },
      { title: 'Artificial Intelligence', author: 'Russell & Norvig', edition: '4th', subject: 'AI', isbn: '978-0134610993', totalCopies: 10, availableCopies: 10 },
    ]);
  }
}

async function ensureDatabase() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 }).catch(async (err) => {
      const isSrvDnsIssue = MONGO_URI.startsWith('mongodb+srv://') && (
        String(err?.message || '').includes('querySrv') ||
        err?.code === 'ECONNREFUSED' ||
        err?.code === 'ENOTFOUND' ||
        err?.code === 'ETIMEOUT'
      );

      if (!isSrvDnsIssue) throw err;

      dns.setServers(['8.8.8.8', '1.1.1.1']);
      return mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    });
  }
  await connectionPromise;

  if (!seedPromise) {
    seedPromise = seedDatabase();
  }
  await seedPromise;
}

module.exports = async (req, res) => {
  await ensureDatabase();
  return app(req, res);
};
