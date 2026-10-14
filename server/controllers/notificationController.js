const Notification = require('../models/Notification');

// @desc Get user notifications
// @route GET /api/notifications
// @access Private
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark notification read
// @route PUT /api/notifications/:id/read
// @access Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
