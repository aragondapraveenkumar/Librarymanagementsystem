const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  author:          { type: String, required: true, trim: true },
  edition:         { type: String, default: '1st' },
  subject:         { type: String, required: true, trim: true },
  isbn:            { type: String, required: true, unique: true, trim: true },
  totalCopies:     { type: Number, required: true, min: 1, default: 1 },
  availableCopies: { type: Number, required: true, min: 0 },
  imageBase64:     { type: String, default: null }
}, { timestamps: true });

// Ensure availableCopies <= totalCopies
bookSchema.pre('save', function(next) {
  if (this.availableCopies > this.totalCopies) this.availableCopies = this.totalCopies;
  next();
});

module.exports = mongoose.model('Book', bookSchema);
