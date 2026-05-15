const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', studentController.getDashboard);
router.get('/my-courses', studentController.getMyCourses);
router.post('/progress', studentController.updateProgress);
router.post('/wishlist/:courseId', studentController.toggleWishlist);
router.get('/quiz-results', studentController.getQuizResults);

module.exports = router;
