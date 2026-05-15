const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses', 'title thumbnail instructor rating');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'avatar'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
