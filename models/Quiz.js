const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true }, // index of correct option
  explanation: { type: String },
});

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 30 }, // minutes
    passingScore: { type: Number, default: 60 }, // percentage
    attempts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number },
        answers: [Number],
        completedAt: { type: Date, default: Date.now },
        passed: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
