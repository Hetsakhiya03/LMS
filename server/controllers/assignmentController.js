const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc Submit assignment solution
// @route POST /api/assignments/:id/submit
// @access Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const { textSubmission, fileUrl } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignment: assignmentId, student: req.user._id },
      {
        assignment: assignmentId,
        student: req.user._id,
        course: assignment.course,
        textSubmission: textSubmission || '',
        fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        submittedAt: new Date(),
        status: 'submitted',
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully!',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Grade assignment submission (Instructor)
// @route PUT /api/assignments/submissions/:submissionId/grade
// @access Private (Instructor/Admin)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { marksObtained, feedback } = req.body;

    const submission = await AssignmentSubmission.findByIdAndUpdate(
      req.params.submissionId,
      {
        marksObtained,
        feedback,
        status: 'graded',
        gradedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};
