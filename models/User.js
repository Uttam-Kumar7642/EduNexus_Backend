const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  // Student profile fields
  collegeName: { type: String, default: '' },
  yearOfStudy: { type: String, default: '' },
  degree: { type: String, default: '' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [String],
    percentage: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
