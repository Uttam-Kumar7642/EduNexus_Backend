const Quiz = require('../models/Quiz');

exports.getQuizByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select('-attempts');
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-attempts');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    quiz.attempts.push({
      user: req.user._id,
      score,
      answers,
      passed,
    });
    await quiz.save();

    res.json({
      score,
      passed,
      correct,
      total: quiz.questions.length,
      message: passed ? 'Congratulations! You passed!' : 'Keep practicing. You can do it!',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: 'Quiz created.', quiz });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
