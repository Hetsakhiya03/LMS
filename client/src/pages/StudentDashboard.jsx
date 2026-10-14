import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle2, Play, Clock, Sparkles, ArrowRight, Loader2, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments');
        if (res.success) {
          setEnrollments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progressPercentage === 100 || e.isCompleted).length;
  const inProgressCourses = totalCourses - completedCourses;

  // Chart data
  const activityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.0 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 5.2 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 6.0 },
    { day: 'Sun', hours: 4.5 },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ── Welcome Banner ── */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #d1fae5',
        borderRadius: 8,
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: 12,
            fontWeight: 700,
            width: 'fit-content'
          }}>
            <Sparkles size={14} color="#16a34a" /> Student Workspace
          </div>

          {(user?.role === 'instructor' || user?.role === 'admin') && (
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/instructor/dashboard'} style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 4,
                background: '#1a8754',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}>
                {user?.role === 'admin' ? 'Open Admin Panel →' : 'Switch to Instructor Studio →'}
              </button>
            </Link>
          )}
        </div>
        
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0, lineHeight: 1.25 }}>
          Welcome back, <span style={{ color: '#1a8754' }}>{user?.name}</span> 👋
        </h1>
        
        <p style={{ fontSize: 14, color: '#4b5563', margin: 0, maxWidth: 620, lineHeight: 1.6 }}>
          Track your ongoing masterclasses, take timed quizzes, submit assignments, and claim your verified certificates.
        </p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="dashboard-metrics-grid">
        
        {/* Card 1: Enrolled */}
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
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Enrolled</span>
          </div>
        </div>

        {/* Card 2: In Progress */}
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
            <Clock size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{inProgressCourses}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>In Progress</span>
          </div>
        </div>

        {/* Card 3: Completed */}
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
            <CheckCircle2 size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{completedCourses}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Completed</span>
          </div>
        </div>

        {/* Card 4: Certificates */}
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
            <Award size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', lineHeight: 1 }}>{completedCourses}</span>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Certificates Earned</span>
          </div>
        </div>

      </div>

      {/* ── Middle Section: Analytics & Continue Learning ── */}
      <div className="dashboard-middle-grid">
        
        {/* Left: Weekly Learning Velocity Chart */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={18} color="#1a8754" />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1c1d1f' }}>Weekly Learning Velocity</span>
            </div>
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Hours spent this week</span>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a8754" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1a8754" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#1c1d1f',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                    padding: '8px 12px'
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#1a8754" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Continue Learning Feature Box */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Resume Study
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
                Continue Learning
              </h3>
            </div>

            {enrollments.length > 0 && enrollments[0]?.course ? (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #d1fae5',
                borderRadius: 8,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1d1f' }}>
                  {enrollments[0].course.title}
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                    <span>Course Progress</span>
                    <strong style={{ color: '#1a8754' }}>{enrollments[0].progressPercentage}%</strong>
                  </div>
                  <div style={{ width: '100%', height: 6, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: '#1a8754', width: `${enrollments[0].progressPercentage}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                <Link to={`/learning/${enrollments[0].course._id}`} style={{ textDecoration: 'none', marginTop: 4 }}>
                  <button style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 4,
                    background: '#1a8754',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}>
                    <Play size={14} /> Resume Lecture
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{
                background: '#f9fafb',
                border: '1px solid #f3f4f6',
                borderRadius: 8,
                padding: '24px 16px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: 13,
                lineHeight: 1.6
              }}>
                You are not currently enrolled in any course. Explore the marketplace to get started!
              </div>
            )}
          </div>

          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: 4,
              background: '#ffffff',
              color: '#1c1d1f',
              border: '1px solid #1c1d1f',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>
              Browse More Courses <ArrowRight size={15} />
            </button>
          </Link>
        </div>

      </div>

      {/* ── My Enrolled Courses Section ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
            My Enrolled Courses
          </h2>
          {enrollments.length > 0 && (
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
              {enrollments.length} Course{enrollments.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
            <Loader2 size={32} color="#1a8754" className="animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #d1fae5',
            borderRadius: 8,
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 16
          }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a8754'
            }}>
              <BookOpen size={24} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: 440 }}>
              <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>
                No courses enrolled yet
              </h4>
              <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
                Discover top-rated online courses and start building your skills today.
              </p>
            </div>

            <Link to="/courses" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 28px',
                borderRadius: 4,
                background: '#1a8754',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
              }}>
                Find Courses
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {enrollments.map((item) => (
              <div key={item._id} style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <img
                    src={item.course?.thumbnail}
                    alt={item.course?.title}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1d1f', lineHeight: 1.3 }}>
                    {item.course?.title}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                      <span>Progress</span>
                      <strong style={{ color: '#1a8754' }}>{item.progressPercentage}%</strong>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, background: '#1a8754', width: `${item.progressPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                  <Link to={`/learning/${item.course?._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: 4,
                      background: '#1a8754',
                      color: '#ffffff',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}>
                      <Play size={14} /> Go to Course
                    </button>
                  </Link>

                  {item.progressPercentage === 100 && (
                    <Link to={`/certificate/${item.course?._id}`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        padding: '10px 14px',
                        borderRadius: 4,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }} title="View Certificate">
                        <Award size={16} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;
