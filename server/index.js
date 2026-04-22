require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./db');

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`VEMU Library Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
