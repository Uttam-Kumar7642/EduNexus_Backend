const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, payments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isPublished: true }),
      Payment.find({ status: 'paid' })
    ]);
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    res.json({ success: true, stats: { totalUsers, totalCourses, totalRevenue, totalLeads: 0, totalEnrollments: payments.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    res.json({ success: true, leads: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    res.json({ success: true, message: 'Lead created.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
