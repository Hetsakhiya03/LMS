import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Clock, BookOpen, Users, CheckCircle2,
  Play, Lock, ChevronDown, ChevronUp, Sparkles, Heart, ArrowRight, Loader2 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSection, setExpandedSection] = useState(0);
  const [reviews, setReviews] = useState([]);

  // User review input
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fallbackThumbnail = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.success) {
          setCourse(res.data);
        }

        // Fetch reviews
        const revRes = await api.get(`/reviews/course/${id}`);
        if (revRes.success) {
          setReviews(revRes.data || []);
        }

        // Check enrollment status if user logged in
        if (isAuthenticated) {
          const checkRes = await api.get(`/enrollments/check/${id}`);
          if (checkRes.success) {
            setIsEnrolled(checkRes.isEnrolled);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  // Handle Enrollment / Purchase
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (course.price > 0 && !course.isFree) {
      navigate(`/checkout/${course._id}`);
      return;
    }

    // Free Course Instant Enrollment
    setEnrolling(true);
    try {
      const res = await api.post(`/enrollments/${course._id}`);
      if (res.success) {
        setIsEnrolled(true);
        navigate(`/learning/${course._id}`);
      }
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/wishlist/toggle/${course._id}`);
      if (res.success) {
        setIsWishlisted(res.isWishlisted);
      }
    } catch (err) {
      console.error('Wishlist error');
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        courseId: course._id,
        rating: newRating,
        comment: newComment,
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        alert('Thank you! Your review has been published.');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Loading course breakdown...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 24px', gap: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1c1d1f' }}>Course Not Found</h2>
        <Link to="/courses" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', borderRadius: 4, background: '#1a8754', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Browse Marketplace
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40, paddingBottom: 60 }}>
      
      {/* ── HERO BANNER SECTION ── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5', padding: '48px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="course-details-grid">
            
            {/* Left Column: Course Intro */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #bbf7d0'
                }}>
                  {course.category?.name || 'General'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: '#ffffff',
                  color: '#4b5563',
                  border: '1px solid #d1d5db'
                }}>
                  {course.level || 'All Levels'}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1c1d1f', margin: 0, lineHeight: 1.25 }}>
                {course.title}
              </h1>

              {/* Description */}
              <p style={{ fontSize: 16, color: '#4b5563', margin: 0, lineHeight: 1.65 }}>
                {course.description}
              </p>

              {/* Meta stats row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', paddingTop: 6, fontSize: 13, color: '#4b5563' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#1c1d1f' }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  {course.averageRating || 5.0}
                  <span style={{ color: '#6b7280', fontWeight: 400 }}>({course.ratingsCount || 0} reviews)</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={16} color="#2563eb" /> {course.totalStudents || 0} Students Enrolled
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={16} color="#1a8754" /> {course.duration || '24 Hours'}
                </span>
              </div>

              {/* Instructor snippet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10 }}>
                <img
                  src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={course.instructor?.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1fae5' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Created by</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1c1d1f' }}>{course.instructor?.name}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Course Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {/* Media Preview */}
              <div style={{ position: 'relative', width: '100%', height: 210, borderRadius: 6, overflow: 'hidden', background: '#f3f4f6' }}>
                <img
                  src={course.thumbnail || fallbackThumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackThumbnail;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: '#1a8754',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
                  }}>
                    <Play size={20} fill="#ffffff" style={{ marginLeft: 3 }} />
                  </div>
                </div>
              </div>

              {/* Price & Wishlist row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f' }}>
                  {course.isFree ? 'FREE' : `$${course.price}`}
                </span>
                <button
                  onClick={handleToggleWishlist}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    background: isWishlisted ? '#ffe4e6' : '#ffffff',
                    color: isWishlisted ? '#e11d48' : '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : '#6b7280'} />
                </button>
              </div>

              {/* CTA Action */}
              {isEnrolled ? (
                <Link to={`/learning/${course._id}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 4,
                    background: '#1a8754',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 2px 6px rgba(26,135,84,0.3)'
                  }}>
                    <Play size={16} /> Continue Learning
                  </button>
                </Link>
              ) : (
                <button
                  disabled={enrolling}
                  onClick={handleEnroll}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 4,
                    background: '#1a8754',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 700,
                    border: 'none',
                    cursor: enrolling ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 2px 6px rgba(26,135,84,0.3)'
                  }}
                >
                  <Sparkles size={16} />
                  {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll Now (Free)' : `Enroll Now ($${course.price})`}
                </button>
              )}

              {/* Benefits Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                  <CheckCircle2 size={16} color="#1a8754" /> Full Lifetime Access
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                  <CheckCircle2 size={16} color="#1a8754" /> Access on Mobile & Desktop
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                  <CheckCircle2 size={16} color="#1a8754" /> Verified PDF Certificate of Completion
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BODY CONTENT CONTAINER ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* What You Will Learn */}
        {course.learningObjectives && course.learningObjectives.length > 0 && (
          <section style={{
            background: '#f0fdf4',
            border: '1px solid #d1fae5',
            borderRadius: 8,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 18
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
              What You Will Learn
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
              {course.learningObjectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#1c1d1f', lineHeight: 1.5 }}>
                  <CheckCircle2 size={18} color="#1a8754" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Course Curriculum Accordion */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
              Course Curriculum
            </h3>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
              {course.sections?.length || 0} Sections
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {course.sections && course.sections.map((section, idx) => (
              <div key={section._id || idx} style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#ffffff'
              }}>
                {/* Header Accordion Button */}
                <button
                  onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: '#f9fafb',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: '#ecfdf5',
                      color: '#1a8754',
                      border: '1px solid #d1fae5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 13
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>
                        {section.title}
                      </h4>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {section.lectures?.length || 0} Lectures {section.quiz ? '• 1 Quiz' : ''} {section.assignment ? '• 1 Assignment' : ''}
                      </span>
                    </div>
                  </div>

                  {expandedSection === idx ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
                </button>

                {/* Lectures List */}
                {expandedSection === idx && (
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 8, background: '#ffffff' }}>
                    {section.lectures && section.lectures.map((lec) => (
                      <div key={lec._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 6,
                        background: '#f9fafb',
                        fontSize: 13
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1c1d1f', fontWeight: 500 }}>
                          <Play size={14} color="#1a8754" />
                          <span>{lec.title}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#6b7280', fontSize: 12 }}>
                          <span>{lec.duration || '10:00'}</span>
                          {lec.isFreePreview ? (
                            <span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 11 }}>
                              Preview
                            </span>
                          ) : (
                            <Lock size={14} color="#9ca3af" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Student Reviews */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
            Student Reviews
          </h3>

          {/* Add Review Form */}
          {isAuthenticated && isEnrolled && (
            <form onSubmit={handleReviewSubmit} style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>
                Leave a Course Review
              </h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#4b5563', fontWeight: 600 }}>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer' }}
                  >
                    <Star size={20} color="#f59e0b" fill={star <= newRating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your learning experience..."
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  outline: 'none',
                  color: '#1c1d1f'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />

              <button
                type="submit"
                disabled={reviewSubmitting}
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 20px',
                  borderRadius: 4,
                  background: '#1a8754',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: reviewSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {reviewSubmitting ? 'Publishing...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                No reviews yet for this course. Be the first to leave feedback!
              </p>
            ) : (
              reviews.map((rev, i) => (
                <div key={rev._id || i} style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={rev.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                        alt={rev.student?.name}
                        style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1c1d1f' }}>
                        {rev.student?.name || 'Student'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} size={14} color="#f59e0b" fill={s < rev.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

    </div>
  );
};

export default CourseDetailsPage;
