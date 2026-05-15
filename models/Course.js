const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  shortDescription: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorName: String,
  instructorBio: String,
  category: { type: String, required: true },
  subcategory: String,
  tags: [String],
  level: { type: String, enum: ['Beginner','Intermediate','Advanced','All Levels'], default: 'All Levels' },
  language: { type: String, default: 'English' },
  thumbnail: String,
  previewVideo: String,
  price: { type: Number, required: true, default: 0 },
  originalPrice: Number,
  isFree: { type: Boolean, default: false },
  currency: { type: String, default: 'INR' },
  totalLessons: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  requirements: [String],
  whatYouLearn: [String],
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  certificate: { type: Boolean, default: true },
}, { timestamps: true });

courseSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
