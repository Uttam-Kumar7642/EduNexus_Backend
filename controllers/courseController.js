const Course = require('../models/Course');
const User = require('../models/User');

exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, sort, page = 1, limit = 20, minPrice, maxPrice } = req.query;
    const query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    let sortObj = { createdAt: -1 };
    if (sort === 'popular') sortObj = { totalStudents: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'price-low') sortObj = { price: 1 };
    if (sort === 'price-high') sortObj = { price: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(query).sort(sortObj).skip(skip).limit(Number(limit)).select('-sections'),
      Course.countDocuments(query)
    ]);
    res.json({ success: true, courses, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }).select('-sections');
    res.json({ success: true, courses, total: courses.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isFeatured: true }).limit(8).select('-sections');
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user._id,
      instructorName: req.body.instructorName || req.user.name,
    };
    const course = new Course(courseData);
    await course.save();
    res.status(201).json({ success: true, message: 'Course created.', course });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course updated.', course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    const alreadyReviewed = course.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed.' });
    course.reviews.push({ user: req.user._id, userName: req.user.name, rating: Number(rating), comment });
    course.totalRatings = course.reviews.length;
    course.rating = course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length;
    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category', {});
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }).select('-sections');
    res.json({ success: true, courses, total: courses.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
