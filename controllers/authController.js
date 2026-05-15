const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: `"EduNexus" <${process.env.EMAIL_USER}>`, to, subject, html });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, collegeName, yearOfStudy, degree } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered.' });
    const user = await User.create({ name, email, password, phone, collegeName, yearOfStudy, degree });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Registration successful.', token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const userWithPass = await User.findOne({ email }).select('+password');
    if (!userWithPass) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    const isMatch = await userWithPass.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    const user = await User.findById(userWithPass._id);
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful.', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try {
      await sendEmail({
        to: email,
        subject: 'EduNexus — Your OTP Code',
        html: `<h2>Your OTP: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
      });
    } catch (e) { console.warn('Email failed:', e.message); }
    res.json({ success: true, message: 'OTP sent.', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    if (user.otpExpires < new Date()) return res.status(400).json({ success: false, message: 'OTP expired.' });
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, message: 'OTP verified.', token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true });
    res.json({ success: true, message: 'Profile updated.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    const secret = process.env.ADMIN_SECRET || 'edunexus-admin-2024';
    if (adminSecret !== secret) {
      return res.status(403).json({ success: false, message: 'Invalid admin secret key.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      await User.updateOne({ email }, { role: 'admin' });
      const user = await User.findOne({ email });
      const token = generateToken(user._id);
      return res.json({ success: true, message: 'User upgraded to admin.', token, user });
    }
    const user = await User.create({ name, email, password, role: 'admin', isVerified: true });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Admin registered.', token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
