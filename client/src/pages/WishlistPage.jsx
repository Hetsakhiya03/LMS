import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import api from '../services/api';

const WishlistPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackThumbnail = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80';

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await api.post(`/wishlist/toggle/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error('Failed to remove course from wishlist');
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Saved Courses
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart size={28} color="#e11d48" fill="#e11d48" /> My Saved Wishlist
        </h1>
        <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>Courses you bookmarked to enroll in later.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <Loader2 size={36} color="#1a8754" className="animate-spin" />
          <span style={{ fontSize: 14, color: '#6b7280' }}>Loading wishlist...</span>
        </div>
      ) : courses.length === 0 ? (
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
          gap: 16,
          maxWidth: 480,
          margin: '0 auto'
        }}>
          <Heart size={44} color="#1a8754" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>Your Wishlist is Empty</h3>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0 }}>Explore the marketplace to bookmark your favorite courses.</p>
          </div>
          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '11px 24px',
              borderRadius: 4,
              background: '#1a8754',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}>
              Browse Courses
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {courses.map((course) => (
            <div key={course._id} style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div>
                <div style={{ position: 'relative', width: '100%', height: 165, background: '#f3f4f6', overflow: 'hidden' }}>
                  <img
                    src={course.thumbnail || fallbackThumbnail}
                    alt={course.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackThumbnail;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleRemove(course._id)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '6px 8px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e5e7eb',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#1c1d1f' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      {course.averageRating || 5.0}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1a8754' }}>
                      {course.isFree ? 'FREE' : `$${course.price}`}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#1c1d1f',
                    margin: 0,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {course.title}
                  </h3>
                </div>
              </div>

              <div style={{ padding: '0 16px 16px' }}>
                <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 4,
                    background: '#1a8754',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}>
                    View & Enroll <ArrowRight size={14} />
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
