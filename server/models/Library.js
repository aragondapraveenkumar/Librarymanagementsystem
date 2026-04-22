const mongoose = require('mongoose');

// ─── Issued Book ────────────────────────────────────────────────
const issuedBookSchema = new mongoose.Schema({
  bookId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:  { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate:   { type: Date, required: true },
  returned:  { type: Boolean, default: false },
  returnedAt:{ type: Date },
  fine:      { type: Number, default: 0 }
}, { timestamps: true });

// ─── Pending Request ────────────────────────────────────────────
const requestSchema = new mongoose.Schema({
  bookId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:    { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });

// ─── Recommendation ─────────────────────────────────────────────
const recommendationSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  suggestedBy: { type: String, required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  archived:    { type: Boolean, default: false }
}, { timestamps: true });

// ─── Feedback ───────────────────────────────────────────────────
const feedbackSchema = new mongoose.Schema({
  type:     { type: String, required: true },
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  from:     { type: String, required: true },
  username: { type: String, required: true },
  role:     { type: String, required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = {
  IssuedBook:     mongoose.model('IssuedBook',     issuedBookSchema),
  Request:        mongoose.model('Request',        requestSchema),
  Recommendation: mongoose.model('Recommendation', recommendationSchema),
  Feedback:       mongoose.model('Feedback',       feedbackSchema)
};
