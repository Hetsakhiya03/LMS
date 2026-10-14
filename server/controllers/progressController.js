const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Certificate = require('../models/Certificate');
const { v4: uuidv4 } = require('crypto'); // Built-in node crypto

// @desc Mark a lecture completed & recalculate course progress percentage
// @route POST /api/progress/:courseId/complete-lecture
// @access Private
exports.markLectureCompleted = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lectureId } = req.body;
    const studentId = req.user._id;

    let progress = await Progress.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await Progress.create({ student: studentId, course: courseId });
    }

    // Add lecture to completed array if not already present
    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    }
    progress.lastAccessedLecture = lectureId;

    // Calculate total lectures count in course
    const course = await Course.findById(courseId).populate({
      path: 'sections',
      populate: { path: 'lectures' },
    });

    let totalLectures = 0;
    if (course && course.sections) {
      course.sections.forEach((sec) => {
        if (sec.lectures) totalLectures += sec.lectures.length;
      });
    }

    // Compute percentage
    if (totalLectures > 0) {
      progress.overallPercentage = Math.min(
        100,
        Math.round((progress.completedLectures.length / totalLectures) * 100)
      );
    } else {
      progress.overallPercentage = 100;
    }

    // Check if course is 100% completed
    if (progress.overallPercentage === 100) {
      progress.isCompleted = true;
      if (!progress.completedAt) progress.completedAt = new Date();

      // Check if Certificate already exists for this student and course
      let certificate = await Certificate.findOne({ student: studentId, course: courseId });
      if (!certificate) {
        const certId = `LP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        
        certificate = await Certificate.create({
          certificateId: certId,
          student: studentId,
          course: courseId,
          instructor: course.instructor?._id || course.instructor,
          issueDate: new Date(),
          verificationUrl: `/verify-certificate/${certId}`,
        });
      }

      progress.certificate = certificate._id;

      // Update Enrollment status to completed if exists
      const Enrollment = require('../models/Enrollment');
      await Enrollment.findOneAndUpdate(
        { student: studentId, course: courseId },
        { status: 'completed', completedAt: new Date() }
      );
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: progress.isCompleted ? 'Congratulations! Course completed!' : 'Lecture marked as completed',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get student progress for a course
// @route GET /api/progress/:courseId
// @access Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const progress = await Progress.findOne({ student: req.user._id, course: courseId })
      .populate('certificate');

    res.status(200).json({
      success: true,
      data: progress || {
        completedLectures: [],
        overallPercentage: 0,
        isCompleted: false,
      },
    });
  } catch (error) {
    next(error);
  }
};
