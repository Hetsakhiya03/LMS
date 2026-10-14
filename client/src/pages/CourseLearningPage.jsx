import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, CheckCircle2, Circle, Download, FileText, 
  HelpCircle, ArrowLeft, Award, Loader2, Check, Clock, BookOpen, X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'resources', 'notes'
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);

  // Fetch Course & Progress
  useEffect(() => {
    const fetchLearningData = async () => {
      setLoading(true);
      try {
        const courseRes = await api.get(`/courses/${courseId}`);
        if (courseRes.success) {
          setCourse(courseRes.data);
          
          // Set initial lecture to first lecture of first section
          if (courseRes.data.sections && courseRes.data.sections.length > 0) {
            const firstSec = courseRes.data.sections[0];
            if (firstSec.lectures && firstSec.lectures.length > 0) {
              setCurrentLecture(firstSec.lectures[0]);
            }
          }
        }

        const progRes = await api.get(`/progress/${courseId}`);
        if (progRes.success) {
          setProgress(progRes.data);
        }
      } catch (err) {
        console.error('Failed to load video learning page:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  // Mark Lecture Completed
  const handleMarkCompleted = async () => {
    if (!currentLecture) return;
    setMarking(true);
    try {
      const res = await api.post(`/progress/${courseId}/complete-lecture`, {
        lectureId: currentLecture._id,
      });

      if (res.success) {
        setProgress(res.data);
        if (res.data.isCompleted || res.data.overallPercentage === 100) {
          setShowCertModal(true);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update lecture progress');
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = (lectureId) => {
    return progress?.completedLectures?.includes(lectureId);
  };

  // Compute total lectures and completed count
  const allLectures = course?.sections?.flatMap(s => s.lectures || []) || [];
  const completedCount = allLectures.filter(lec => isCompleted(lec._id)).length;
  const progressPercent = allLectures.length > 0 ? Math.round((completedCount / allLectures.length) * 100) : (progress?.overallPercentage || 0);

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Opening learning workspace...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* ── Sub-header Bar (Under Navbar) ── */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        position: 'sticky',
        top: 64,
        zIndex: 30,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <Link to="/student/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 4, background: '#f3f4f6',
                border: '1px solid #e5e7eb', color: '#374151', fontSize: 13,
                fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s'
              }}>
                <ArrowLeft size={14} /> Dashboard
              </button>
            </Link>

            <div style={{ width: 1, height: 20, background: '#e5e7eb' }}></div>

            <h1 style={{ fontSize: 15, fontWeight: 700, color: '#1c1d1f', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {course?.title}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Course Progress:</span>
              <div style={{ width: 120, height: 8, borderRadius: 4, background: '#e5e7eb', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#1a8754', transition: 'width 0.3s' }}></div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a8754' }}>{progressPercent}%</span>
            </div>

            {(progress?.isCompleted || progressPercent === 100) && (
              <Link to={`/certificate/${courseId}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 4, background: '#1a8754',
                  color: '#ffffff', fontSize: 13, fontWeight: 700, border: 'none',
                  cursor: 'pointer', boxShadow: '0 2px 6px rgba(26,135,84,0.3)'
                }}>
                  <Award size={14} /> Certificate
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ── Main Learning Split Workspace ── */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px' }}>
        <div className="learning-workspace-grid">
          
          {/* Left Column: Video Player & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Video Container */}
            {currentLecture ? (
              <div style={{
                aspectRatio: '16 / 9',
                width: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#000000',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                position: 'relative'
              }}>
                <video
                  key={currentLecture._id || currentLecture.videoUrl}
                  src={currentLecture.videoUrl}
                  controls
                  autoPlay={false}
                  controlsList="nodownload"
                  poster={course?.thumbnail}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              </div>
            ) : (
              <div style={{
                aspectRatio: '16 / 9',
                width: '100%',
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: '#6b7280'
              }}>
                <Play size={48} color="#1a8754" />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>Select a Lecture to Begin</h3>
                <p style={{ fontSize: 13, margin: 0 }}>Choose a lesson from the course curriculum on the right.</p>
              </div>
            )}

            {/* Lecture Action Control Card */}
            {currentLecture && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
                    {currentLecture.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} /> Duration: {currentLecture.duration || '10:00'}
                    </span>
                    {isCompleted(currentLecture._id) && (
                      <span style={{ color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleMarkCompleted}
                  disabled={marking}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '11px 22px',
                    borderRadius: 4,
                    background: isCompleted(currentLecture._id) ? '#dcfce7' : '#1a8754',
                    color: isCompleted(currentLecture._id) ? '#15803d' : '#ffffff',
                    border: isCompleted(currentLecture._id) ? '1px solid #bbf7d0' : 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: marking ? 'wait' : 'pointer',
                    transition: 'background 0.15s'
                  }}
                >
                  {isCompleted(currentLecture._id) ? (
                    <>
                      <Check size={16} /> Completed ✓
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> {marking ? 'Updating...' : 'Mark as Completed'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tabbed Info Card (Overview, Resources, Notes) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}>
              {/* Tab Header Buttons */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                background: '#fafafa',
                padding: '0 16px'
              }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    padding: '14px 20px',
                    fontSize: 14,
                    fontWeight: activeTab === 'overview' ? 700 : 500,
                    color: activeTab === 'overview' ? '#1a8754' : '#6b7280',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'overview' ? '3px solid #1a8754' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  Lesson Overview
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  style={{
                    padding: '14px 20px',
                    fontSize: 14,
                    fontWeight: activeTab === 'resources' ? 700 : 500,
                    color: activeTab === 'resources' ? '#1a8754' : '#6b7280',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'resources' ? '3px solid #1a8754' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  Resources & Downloads ({currentLecture?.resources?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    padding: '14px 20px',
                    fontSize: 14,
                    fontWeight: activeTab === 'notes' ? 700 : 500,
                    color: activeTab === 'notes' ? '#1a8754' : '#6b7280',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'notes' ? '3px solid #1a8754' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  Study Notes
                </button>
              </div>

              {/* Tab Contents */}
              <div style={{ padding: '24px' }}>
                {activeTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>About this lesson</h3>
                    <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                      {currentLecture?.description || 'In this lecture, you will master the core concepts covered in this module. Follow along with the instructor and practice with the code snippets.'}
                    </p>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {currentLecture?.resources && currentLecture.resources.length > 0 ? (
                      currentLecture.resources.map((res, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '14px 18px',
                            borderRadius: 6,
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FileText size={18} color="#1a8754" />
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1d1f' }}>{res.title}</span>
                          </div>
                          <a href={res.fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <button style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '7px 14px', borderRadius: 4, background: '#ffffff',
                              border: '1px solid #1a8754', color: '#1a8754', fontSize: 13,
                              fontWeight: 700, cursor: 'pointer'
                            }}>
                              <Download size={14} /> Download PDF
                            </button>
                          </a>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                        No downloadable files attached to this lecture.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Take timestamped notes while watching..."
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        color: '#1c1d1f',
                        background: '#ffffff',
                        outline: 'none',
                        lineHeight: 1.6
                      }}
                      onFocus={e => e.target.style.borderColor = '#1a8754'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                    <button
                      onClick={() => alert('Note saved locally!')}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '9px 18px',
                        borderRadius: 4,
                        background: '#1a8754',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Save Notes
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Curriculum Sidebar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: 130
          }}>
            {/* Sidebar Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} color="#1a8754" />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
                  Course Curriculum
                </h3>
              </div>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {allLectures.length} lessons • {completedCount} completed
              </span>
            </div>

            {/* Sections List */}
            <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {course?.sections && course.sections.map((section, sIdx) => (
                <div key={section._id || sIdx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  
                  {/* Section Title Header */}
                  <div style={{
                    padding: '12px 18px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1c1d1f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Section {sIdx + 1}: {section.title}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
                      {section.lectures?.length || 0} lessons
                    </span>
                  </div>

                  {/* Lecture items */}
                  <div>
                    {section.lectures && section.lectures.map((lec) => {
                      const isSelected = currentLecture?._id === lec._id;
                      const completed = isCompleted(lec._id);

                      return (
                        <button
                          key={lec._id}
                          onClick={() => setCurrentLecture(lec)}
                          style={{
                            width: '100%',
                            padding: '12px 18px',
                            background: isSelected ? '#f0fdf4' : '#ffffff',
                            border: 'none',
                            borderBottom: '1px solid #f3f4f6',
                            borderLeft: isSelected ? '4px solid #1a8754' : '4px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.1s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                            {completed ? (
                              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                            ) : (
                              <Circle size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
                            )}
                            <span style={{
                              fontSize: 13,
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? '#15803d' : '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {lec.title}
                            </span>
                          </div>

                          <span style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                            {lec.duration || '10:00'}
                          </span>
                        </button>
                      );
                    })}

                    {/* Section Quiz Link (if present) */}
                    {section.quiz && (
                      <div style={{ padding: '8px 14px' }}>
                        <Link to={`/quiz/${section.quiz._id || section.quiz}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: 6,
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <HelpCircle size={14} color="#16a34a" /> Section Assessment Quiz
                            </span>
                            <span>Take Quiz →</span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* 🎓 Completion Congratulations Modal */}
      {showCertModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, padding: '40px 48px',
            maxWidth: 540, width: '100%', textAlign: 'center',
            display: 'flex', flexDirection: 'column', gap: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative'
          }}>
            <button onClick={() => setShowCertModal(false)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none',
              border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={20} />
            </button>

            <div style={{ fontSize: 56 }}>🎓</div>

            <div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#1c1d1f', margin: '0 0 10px' }}>
                Congratulations, {user?.name}!
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                You've successfully completed{' '}
                <strong style={{ color: '#1a8754' }}>{course?.title}</strong>!
                <br />Your certificate is ready to view and share.
              </p>
            </div>

            <div style={{
              background: '#f0fdf4', border: '1px solid #d1fae5',
              borderRadius: 10, padding: '12px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <CheckCircle2 size={18} color="#1a8754" />
              <span style={{ fontSize: 14, color: '#15803d', fontWeight: 600 }}>
                100% Course Completed
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/certificate/${courseId}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '12px 24px', borderRadius: 8, background: '#1a8754',
                  color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26,135,84,0.3)',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Award size={16} />
                  View My Certificate
                </button>
              </Link>
              <button onClick={() => setShowCertModal(false)} style={{
                padding: '12px 20px', borderRadius: 8, background: '#f3f4f6',
                color: '#374151', fontWeight: 600, fontSize: 14,
                border: '1px solid #e5e7eb', cursor: 'pointer'
              }}>
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseLearningPage;
