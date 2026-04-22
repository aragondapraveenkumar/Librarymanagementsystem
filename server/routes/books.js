const router = require('express').Router();
const Book = require('../models/Book');
const { auth, requireRole } = require('../middleware/auth');

// GET all books (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter = { $or: [{ title: regex }, { author: regex }, { subject: regex }] };
    }
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add book (Librarian only)
router.post('/', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const { title, author, edition, subject, isbn, totalCopies, imageBase64 } = req.body;
    const copies = parseInt(totalCopies) || 1;
    const book = await Book.create({
      title, author, edition, subject, isbn,
      totalCopies: copies, availableCopies: copies, imageBase64: imageBase64 || null
    });
    res.status(201).json(book);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'ISBN already exists' });
    res.status(500).json({ message: err.message });
  }
});

// PUT update book (Librarian only)
router.put('/:id', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const { title, author, edition, subject, isbn, totalCopies, imageBase64 } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const newTotal = parseInt(totalCopies) || book.totalCopies;
    const diff = newTotal - book.totalCopies;

    book.title = title || book.title;
    book.author = author || book.author;
    book.edition = edition || book.edition;
    book.subject = subject || book.subject;
    book.isbn = isbn || book.isbn;
    book.totalCopies = newTotal;
    book.availableCopies = Math.max(0, Math.min(book.availableCopies + diff, newTotal));
    if (imageBase64 !== undefined) book.imageBase64 = imageBase64;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE book (Librarian only)
router.delete('/:id', auth, requireRole('Librarian'), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
