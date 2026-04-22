const router = require('express').Router();
const Book = require('../models/Book');
const User = require('../models/User');
const { IssuedBook, Request, Recommendation, Feedback } = require('../models/Library');
const { auth, requireRole } = require('../middleware/auth');

const DAILY_FINE = 10; // ₹10 per day

// ─── ISSUED BOOKS ───────────────────────────────────────────────

// GET all active issues (Librarian)
router.get('/issues', auth, requireRole('Librarian','Admin'), async (req, res) => {
  try {
    const issues = await IssuedBook.find({ returned: false }).populate('bookId').populate('userId', 'name username role');
    res.json(issues);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET my borrowed books (any user)
router.get('/mybooks', auth, async (req, res) => {
  try {
    const myBooks = await IssuedBook.find({ userId: req.user._id, returned: false }).populate('bookId');
    res.json(myBooks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST issue a book (Librarian only)
router.post('/issue', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) return res.status(400).json({ message: 'Book unavailable' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const days = user.role === 'Faculty' ? 30 : 14;
    const dueDate = new Date(Date.now() + days * 86400000);

    book.availableCopies--;
    await book.save();

    const issued = await IssuedBook.create({
      bookId: book._id, userId: user._id, username: user.username,
      dueDate, returned: false, fine: 0
    });
    res.status(201).json(issued);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST return a book (Librarian only)
router.post('/return/:id', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const issued = await IssuedBook.findById(req.params.id);
    if (!issued || issued.returned) return res.status(400).json({ message: 'Invalid transaction' });

    const book = await Book.findById(issued.bookId);
    if (book) { book.availableCopies++; await book.save(); }

    const now = new Date();
    const due = new Date(issued.dueDate);
    let fine = 0;
    if (now > due) fine = Math.ceil((now - due) / 86400000) * DAILY_FINE;

    issued.returned = true;
    issued.returnedAt = now;
    issued.fine = fine;
    await issued.save();

    res.json({ issued, fine });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── REQUESTS ───────────────────────────────────────────────────

// GET all pending requests (Librarian)
router.get('/requests', auth, requireRole('Librarian','Admin'), async (req, res) => {
  try {
    const reqs = await Request.find({ status: 'pending' }).populate('bookId').populate('userId', 'name username role');
    res.json(reqs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST submit request (Student / Faculty)
router.post('/requests', auth, requireRole('Student','Faculty'), async (req, res) => {
  try {
    const { bookId } = req.body;
    const req2 = await Request.create({ bookId, userId: req.user._id, username: req.user.username });
    res.status(201).json(req2);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT approve request (Librarian)
router.put('/requests/:id/approve', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const book = await Book.findById(request.bookId);
    if (!book || book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    const user = await User.findById(request.userId);
    const days = user?.role === 'Faculty' ? 30 : 14;
    const dueDate = new Date(Date.now() + days * 86400000);

    book.availableCopies--;
    await book.save();

    await IssuedBook.create({
      bookId: book._id, userId: request.userId, username: request.username,
      dueDate, returned: false, fine: 0
    });

    request.status = 'approved';
    await request.save();
    res.json({ message: 'Approved' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT reject request (Librarian)
router.put('/requests/:id/reject', auth, requireRole('Librarian'), async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Rejected' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── RECOMMENDATIONS ────────────────────────────────────────────

router.get('/recommendations', auth, requireRole('Librarian','Admin'), async (req, res) => {
  try {
    const recs = await Recommendation.find({ archived: false }).sort({ createdAt: -1 });
    res.json(recs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/recommendations', auth, requireRole('Faculty'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const rec = await Recommendation.create({ title, author, suggestedBy: req.user.username, userId: req.user._id });
    res.status(201).json(rec);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/recommendations/:id', auth, requireRole('Librarian'), async (req, res) => {
  try {
    await Recommendation.findByIdAndUpdate(req.params.id, { archived: true });
    res.json({ message: 'Archived' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── FEEDBACK ───────────────────────────────────────────────────

router.get('/feedback', auth, requireRole('Admin'), async (req, res) => {
  try {
    const fb = await Feedback.find().sort({ createdAt: -1 });
    res.json(fb);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/feedback', auth, async (req, res) => {
  try {
    const { type, subject, message } = req.body;
    const fb = await Feedback.create({
      type, subject, message,
      from: req.user.name, username: req.user.username,
      role: req.user.role, userId: req.user._id
    });
    res.status(201).json(fb);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── REPORTS ────────────────────────────────────────────────────
router.get('/reports', auth, requireRole('Admin'), async (req, res) => {
  try {
    const [users, books, activeIssues, requests] = await Promise.all([
      require('../models/User').countDocuments(),
      Book.aggregate([{ $group: { _id: null, total: { $sum: '$totalCopies' }, available: { $sum: '$availableCopies' } } }]),
      IssuedBook.countDocuments({ returned: false }),
      Request.countDocuments({ status: 'pending' })
    ]);
    const bookStats = books[0] || { total: 0, available: 0 };
    res.json({ users, bookTitles: await Book.countDocuments(), bookCopies: bookStats.total, available: bookStats.available, activeIssues, requests });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
