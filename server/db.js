require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vemu_library';

let cachedConnection = null;
let cachedSeed = null;

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

async function connectToDatabase() {
  if (!cachedConnection) {
    cachedConnection = mongoose.connect(MONGO_URI).then((connection) => {
      console.log('MongoDB connected');
      return connection;
    });
  }

  await cachedConnection;

  if (!cachedSeed) {
    cachedSeed = seedDatabase();
  }

  await cachedSeed;
}

module.exports = { connectToDatabase };
