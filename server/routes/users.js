const router = require('express').Router();
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// GET users for management/issuing books
router.get('/', auth, requireRole('Admin', 'Librarian'), async (req, res) => {
  try {
    const users = await User.find()
      .select('name username email role rollno isDefault createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user (Admin only, cannot delete default accounts)
router.delete('/:id', auth, requireRole('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isDefault) return res.status(403).json({ message: 'Cannot delete default accounts' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PUT update user details (Admin only)
router.put('/:id', auth, requireRole('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updates = {};
    const allowedRoles = ['Admin', 'Librarian', 'Faculty', 'Student'];

    if (typeof req.body.name === 'string') updates.name = req.body.name.trim();

    if (typeof req.body.username === 'string') {
      const username = req.body.username.trim().toLowerCase();
      const exists = await User.findOne({ username, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      updates.username = username;
    }

    if (typeof req.body.email === 'string') {
      const email = req.body.email.trim().toLowerCase();
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Email already exists' });
      updates.email = email;
    }

    if (typeof req.body.role === 'string') {
      if (!allowedRoles.includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      if (user.isDefault && req.body.role !== user.role) {
        return res.status(403).json({ message: 'Cannot change role of default accounts' });
      }
      updates.role = req.body.role;
    }

    if (typeof req.body.rollno === 'string') updates.rollno = req.body.rollno.trim();

    if (typeof req.body.password === 'string' && req.body.password.trim()) {
      if (req.body.password.trim().length < 4) {
        return res.status(400).json({ message: 'Password must be at least 4 characters' });
      }
      updates.password = req.body.password.trim();
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ message: 'User updated', user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;

