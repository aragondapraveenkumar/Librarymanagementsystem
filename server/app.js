require('dotenv').config();
const express = require('express');
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

module.exports = app;
