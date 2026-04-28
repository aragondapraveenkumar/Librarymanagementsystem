const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));
app.use('/api/library', require('./routes/library'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

async function seedDatabase() {
  const User = require('./models/User');
  const Book = require('./models/Book');

  const count = await User.countDocuments();
  if (count === 0) {
    console.log('Seeding default users...');
    await User.create([
      { name: 'System Administrator', username: 'admin', email: 'admin@vemu.edu', password: 'admin123', role: 'Admin', rollno: 'ADM001', isDefault: true },
      { name: 'Librarian In-charge', username: 'librarian', email: 'librarian@vemu.edu', password: 'lib123', role: 'Librarian', rollno: 'LIB001', isDefault: true },
      { name: 'Rahul Sharma', username: 'student1', email: 'student1@vemu.edu', password: 'stud123', role: 'Student', rollno: '21BCS001' },
      { name: 'Dr. Priya Mehta', username: 'faculty1', email: 'faculty1@vemu.edu', password: 'fac123', role: 'Faculty', rollno: 'FAC001' },
    ]);
    console.log('Default users created');
  }

  const bCount = await Book.countDocuments();
  if (bCount === 0) {
    console.log('Seeding default books...');
    await Book.create([
      { title: 'Introduction to Algorithms', author: 'Cormen et al.', edition: '4th', subject: 'Computer Science', isbn: '978-0262046305', totalCopies: 8, availableCopies: 6 },
      { title: 'Database System Concepts', author: 'Silberschatz', edition: '7th', subject: 'Database', isbn: '978-1260084504', totalCopies: 5, availableCopies: 3 },
      { title: 'Artificial Intelligence', author: 'Russell & Norvig', edition: '4th', subject: 'AI', isbn: '978-0134610993', totalCopies: 10, availableCopies: 10 },
    ]);
    console.log('Default books created');
  }
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI is missing. Add your MongoDB Atlas URI in server/.env');
  process.exit(1);
}

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected:', MONGO_URI.replace(/\/\/.*@/, '//***@'));
    await seedDatabase();
    app.listen(PORT, () => console.log(`VEMU Library Server running on http://localhost:${PORT}`));
  } catch (err) {
    const isSrvDnsIssue = MONGO_URI.startsWith('mongodb+srv://') && (
      String(err?.message || '').includes('querySrv') ||
      err?.code === 'ECONNREFUSED' ||
      err?.code === 'ENOTFOUND' ||
      err?.code === 'ETIMEOUT'
    );

    if (isSrvDnsIssue) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
        console.log('MongoDB connected after DNS fallback');
        await seedDatabase();
        app.listen(PORT, () => console.log(`VEMU Library Server running on http://localhost:${PORT}`));
        return;
      } catch (fallbackErr) {
        console.error('MongoDB connection failed after DNS fallback:', fallbackErr.message);
        process.exit(1);
      }
    }

    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

connectMongo();
