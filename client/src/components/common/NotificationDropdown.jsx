import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, Award, FileText, Check } from 'lucide-react';
import api from '../../services/api';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Graceful fallback for demo state
      setNotifications([
        { _id: '1', title: 'Welcome to LearnPulse!', message: 'Explore top courses and start learning today.', isRead: false, createdAt: new Date() },
        { _id: '2', title: 'Course Enrolled', message: 'You have successfully enrolled in JavaScript MERN Bootcamp.', isRead: true, createdAt: new Date() },
      ]);
      setUnreadCount(1);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-slate-950 animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-800 shadow-2xl z-50 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-bold font-outfit text-white">Notifications</h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
              {unreadCount} New
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-colors cursor-pointer ${
                    !n.isRead
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
