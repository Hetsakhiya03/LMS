import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertCircle, ShieldCheck, BarChart3, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'users'

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.success) setStats(statsRes.data);

      const coursesRes = await api.get('/admin/courses');
      if (coursesRes.success) setCourses(coursesRes.data || []);

      const usersRes = await api.get('/admin/users');
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-suspend`);
      if (res.success) {
        alert(res.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleUpdateCourseStatus = async (courseId, newStatus) => {
    try {
      const res = await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      if (res.success) {
        alert(res.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Loading admin control panel...</p>
      </div>
    );
  }

  const { totalUsers = 0, totalStudents = 0, totalInstructors = 0, totalCourses = 0, totalEnrollments = 0, pendingCourses = 0 } = stats || {};

  const chartData = [
    { name: 'Students', count: totalStudents },
    { name: 'Instructors', count: totalInstructors },
    { name: 'Courses', count: totalCourses },
    { name: 'Enrollments', count: totalEnrollments },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Platform Governance
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
          Admin Control Panel
        </h1>
      </div>

      {/* ── Metric Cards Row ── */}
      <div className="dashboard-metrics-grid">
        
        {/* Users Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            flexShrink: 0
          }}>
            <Users size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{totalUsers}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Registered Users</span>
          </div>
        </div>

        {/* Courses Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: '#ecfdf5',
            border: '1px solid #d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a8754',
            flexShrink: 0
          }}>
            <BookOpen size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{totalCourses}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Courses</span>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706',
            flexShrink: 0
          }}>
            <AlertCircle size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{pendingCourses}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Pending Approvals</span>
          </div>
        </div>

        {/* Total Enrollments Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: '#ecfdf5',
            border: '1px solid #d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1a8754',
            flexShrink: 0
          }}>
            <ShieldCheck size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{totalEnrollments}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Enrollments</span>
          </div>
        </div>

      </div>

      {/* ── Overview Recharts ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={18} color="#1a8754" />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1c1d1f' }}>Platform Growth Overview</span>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#1c1d1f',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="count" fill="#1a8754" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tabs for Course Approvals & User Governance ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'courses' ? '#1a8754' : '#6b7280',
              borderBottom: activeTab === 'courses' ? '2px solid #1a8754' : '2px solid transparent'
            }}
          >
            Course Approvals ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 0',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'users' ? '#1a8754' : '#6b7280',
              borderBottom: activeTab === 'users' ? '2px solid #1a8754' : '2px solid transparent'
            }}
          >
            User Governance ({users.length})
          </button>
        </div>

        {/* Tab 1: Course Approvals */}
        {activeTab === 'courses' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Course Title</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Instructor</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>Approval Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1c1d1f' }}>{course.title}</td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{course.instructor?.name || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{course.category?.name || 'General'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: course.approvalStatus === 'published' ? '#dcfce7' : course.approvalStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: course.approvalStatus === 'published' ? '#15803d' : course.approvalStatus === 'pending' ? '#92400e' : '#dc2626',
                        border: `1px solid ${course.approvalStatus === 'published' ? '#bbf7d0' : course.approvalStatus === 'pending' ? '#fde68a' : '#fecaca'}`
                      }}>
                        {course.approvalStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        {course.approvalStatus !== 'published' && (
                          <button
                            onClick={() => handleUpdateCourseStatus(course._id, 'published')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 4,
                              background: '#1a8754',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: 12,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Approve
                          </button>
                        )}
                        {course.approvalStatus !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateCourseStatus(course._id, 'rejected')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 4,
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: User Governance */}
        {activeTab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>User</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Email</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Role</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>Account Governance</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1c1d1f' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#1a8754' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: u.isSuspended ? '#fee2e2' : '#dcfce7',
                        color: u.isSuspended ? '#dc2626' : '#15803d',
                        border: `1px solid ${u.isSuspended ? '#fecaca' : '#bbf7d0'}`
                      }}>
                        {u.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspend(u._id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 4,
                            background: u.isSuspended ? '#1a8754' : '#fee2e2',
                            border: `1px solid ${u.isSuspended ? '#1a8754' : '#fecaca'}`,
                            color: u.isSuspended ? '#ffffff' : '#dc2626',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          {u.isSuspended ? 'Activate Account' : 'Suspend User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
