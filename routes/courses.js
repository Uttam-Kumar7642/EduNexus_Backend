const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, adminOnly, instructorOrAdmin } = require('../middleware/auth');

router.get('/', courseController.getCourses);
router.get('/all', protect, adminOnly, courseController.getAllCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/categories', courseController.getCategories);
router.get('/:id', courseController.getCourseById);
router.post('/', protect, instructorOrAdmin, courseController.createCourse);
router.put('/:id', protect, instructorOrAdmin, courseController.updateCourse);
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);
router.post('/:id/review', protect, courseController.addReview);

module.exports = router;
