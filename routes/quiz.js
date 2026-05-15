const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/:courseId', protect, quizController.getQuiz);
router.post('/:courseId/submit', protect, quizController.submitQuiz);
router.post('/', protect, adminOnly, quizController.createQuiz);

module.exports = router;
