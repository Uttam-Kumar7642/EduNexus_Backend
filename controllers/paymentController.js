const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID.' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.map(id => id.toString()).includes(courseId);
    if (alreadyEnrolled) return res.status(400).json({ success: false, message: 'Already enrolled.' });
    if (course.isFree || course.price === 0) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });
      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      return res.json({ success: true, free: true, message: 'Enrolled for free!' });
    }
    const razorpay = getRazorpay();
    const receipt = `rcpt_${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: Math.round(course.price * 100),
      currency: 'INR',
      receipt,
      notes: { courseId: courseId.toString(), userId: req.user._id.toString() }
    });
    await Payment.create({
      user: req.user._id, course: courseId,
      razorpayOrderId: order.id, amount: course.price, receipt
    });
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID, course });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId } = req.body;
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expected !== razorpaySignature) return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    await Payment.findOneAndUpdate({ razorpayOrderId }, { razorpayPaymentId, razorpaySignature, status: 'paid' });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
    res.json({ success: true, message: 'Payment verified. Enrolled successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('course', 'title thumbnail price');
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
