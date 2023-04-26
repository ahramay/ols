const mongoose = require("mongoose");

const quizAnswerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz",
  },

  markedByTeacher: {
    type: Boolean,
    default: false,
  },

  totalQuizMarks: {
    type: Number,
    default: 0,
  },

  obtainedMarks: {
    type: Number,
    default: 0,
  },

  questionMarks: {
    type: Object,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chapter",
  },

  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lesson",
  },

  answers: {
    type: Object,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const QuizAnswer = mongoose.model("quizanswer", quizAnswerSchema);

module.exports = {
  QuizAnswer,
};
