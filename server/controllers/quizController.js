const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

// @desc Get quiz by ID with questions
// @route GET /api/quizzes/:id
// @access Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions', '-correctAnswerIndex -explanation');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit quiz answers & calculate score
// @route POST /api/quizzes/:id/submit
// @access Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of { questionId, selectedOption }

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let earnedScore = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach((q) => {
      const userAns = answers.find((a) => a.questionId.toString() === q._id.toString());
      const selectedOpt = userAns ? userAns.selectedOption : -1;
      const isCorrect = selectedOpt === q.correctAnswerIndex;

      if (isCorrect) {
        earnedScore += q.marks;
      }

      evaluatedAnswers.push({
        questionId: q._id,
        selectedOption: selectedOpt,
        isCorrect,
      });
    });

    const totalMarks = quiz.totalMarks || (quiz.questions.length * 5);
    const percentage = Math.round((earnedScore / totalMarks) * 100);
    const passed = percentage >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quizId,
      course: quiz.course,
      answers: evaluatedAnswers,
      score: earnedScore,
      totalQuestions: quiz.questions.length,
      percentage,
      passed,
    });

    res.status(200).json({
      success: true,
      message: passed ? 'Congratulations! You passed the quiz!' : 'Quiz submitted. Practice and try again!',
      data: {
        attemptId: attempt._id,
        score: earnedScore,
        totalMarks,
        percentage,
        passed,
        passingScore: quiz.passingScore,
        details: quiz.questions.map((q) => {
          const evalAns = evaluatedAnswers.find((a) => a.questionId.toString() === q._id.toString());
          return {
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            selectedOption: evalAns ? evalAns.selectedOption : -1,
            isCorrect: evalAns ? evalAns.isCorrect : false,
            explanation: q.explanation,
          };
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};
