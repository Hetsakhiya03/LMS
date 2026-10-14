const Certificate = require('../models/Certificate');

// @desc Get certificate by certificate ID, Mongo ID, or Course ID
// @route GET /api/certificates/:id
// @access Private/Public
exports.getCertificate = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let certificate = null;

    // 1. Try finding by certificateId (e.g. LP-...)
    certificate = await Certificate.findOne({ certificateId: idParam })
      .populate('student', 'name email avatar')
      .populate('course', 'title category duration thumbnail')
      .populate('instructor', 'name headline avatar');

    // 2. If not found and valid ObjectId, check _id or courseId
    if (!certificate && idParam.match(/^[0-9a-fA-F]{24}$/)) {
      // Check if it's the certificate _id
      certificate = await Certificate.findById(idParam)
        .populate('student', 'name email avatar')
        .populate('course', 'title category duration thumbnail')
        .populate('instructor', 'name headline avatar');

      // Check if it's a courseId for the logged-in student
      if (!certificate && req.user) {
        certificate = await Certificate.findOne({
          course: idParam,
          student: req.user._id,
        })
          .populate('student', 'name email avatar')
          .populate('course', 'title category duration thumbnail')
          .populate('instructor', 'name headline avatar');
      }

      // Check if it's a courseId without user (fallback to any certificate for that course)
      if (!certificate) {
        certificate = await Certificate.findOne({ course: idParam })
          .populate('student', 'name email avatar')
          .populate('course', 'title category duration thumbnail')
          .populate('instructor', 'name headline avatar');
      }

      // Auto-generate if student is authenticated, course exists, and not yet generated
      if (!certificate && req.user) {
        const Progress = require('../models/Progress');
        const Course = require('../models/Course');
        const course = await Course.findById(idParam).populate('instructor');
        const progress = await Progress.findOne({ student: req.user._id, course: idParam });

        if (course) {
          const certId = `LP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
          certificate = await Certificate.create({
            certificateId: certId,
            student: req.user._id,
            course: course._id,
            instructor: course.instructor?._id || course.instructor,
            issueDate: new Date(),
            verificationUrl: `/verify-certificate/${certId}`,
          });

          if (progress) {
            progress.isCompleted = true;
            progress.overallPercentage = 100;
            progress.certificate = certificate._id;
            await progress.save();
          }

          certificate = await Certificate.findById(certificate._id)
            .populate('student', 'name email avatar')
            .populate('course', 'title category duration thumbnail')
            .populate('instructor', 'name headline avatar');
        }
      }
    }

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate record not found' });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Public certificate verification lookup
// @route GET /api/certificates/verify/:certificateId
// @access Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('student', 'name')
      .populate('course', 'title')
      .populate('instructor', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Invalid Certificate ID. Certificate could not be verified in LearnPulse registry.',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Certificate Verified Authenticated',
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        instructorName: certificate.instructor.name,
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    next(error);
  }
};
