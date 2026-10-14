import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, DollarSign, Plus, Trash2, Eye, Loader2 } from 'lucide-react';
import api from '../services/api';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/instructor/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load instructor metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Loading instructor studio metrics...</p>
      </div>
    );
  }

  const { totalCourses = 0, totalStudents = 0, averageRating = 5.0, totalRevenue = 0, courses = [] } = stats || {};

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ── Header Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Instructor Studio
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
            Course Management
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/student/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 18px',
              borderRadius: 4,
              background: '#ffffff',
              color: '#1a8754',
              border: '1px solid #1a8754',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}>
              <BookOpen size={16} /> Student View Dashboard
            </button>
          </Link>

          <Link to="/instructor/course-builder" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 4,
              background: '#1a8754',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(26,135,84,0.3)',
              transition: 'background 0.15s'
            }}>
              <Plus size={16} /> Create New Course
            </button>
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="dashboard-metrics-grid">
        
        {/* Card 1: Created Courses */}
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
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Created Courses</span>
          </div>
        </div>

        {/* Card 2: Enrolled Students */}
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
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{totalStudents}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Enrolled Students</span>
          </div>
        </div>

        {/* Card 3: Average Rating */}
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
            <Star size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{averageRating} / 5.0</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Average Rating</span>
          </div>
        </div>

        {/* Card 4: Estimated Revenue */}
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
            <DollarSign size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>${totalRevenue}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Estimated Revenue</span>
          </div>
        </div>

      </div>

      {/* ── Courses Management Table ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
            Your Courses Portfolio
          </h2>
          {courses.length > 0 && (
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{courses.length} Course{courses.length > 1 ? 's' : ''}</span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Course Name</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Price</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Students</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Rating</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a8754' }}>
                        <BookOpen size={22} />
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1c1d1f' }}>No courses built yet</span>
                      <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                        Click "Create New Course" to launch your first masterclass and start teaching!
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1c1d1f' }}>{course.title}</td>
                    <td style={{ padding: '14px 16px', color: '#4b5563', fontWeight: 600 }}>
                      {course.price === 0 ? <span style={{ color: '#1a8754' }}>FREE</span> : `$${course.price}`}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>{course.totalStudents || 0}</td>
                    <td style={{ padding: '14px 16px', color: '#4b5563' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#1c1d1f' }}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" /> {course.averageRating || 5.0}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: course.approvalStatus === 'published' ? '#dcfce7' : '#fef3c7',
                        color: course.approvalStatus === 'published' ? '#15803d' : '#92400e',
                        border: `1px solid ${course.approvalStatus === 'published' ? '#bbf7d0' : '#fde68a'}`
                      }}>
                        {course.approvalStatus || 'published'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            color: '#4b5563',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }} title="Preview Course">
                            <Eye size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 4,
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default InstructorDashboard;
