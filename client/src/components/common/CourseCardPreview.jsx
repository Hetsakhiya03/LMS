import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';

const CourseCardPreview = ({ course }) => {
  const {
    _id = 1,
    title = 'Full-Stack Web Development Bootcamp',
    instructor = 'Alex Rivera',
    category = 'Web Development',
    level = 'All Levels',
    rating = 4.8,
    reviewsCount = 2341,
    studentsCount = 12500,
    duration = '32 total hours',
    lecturesCount = 48,
    price = 49.99,
    isFree = false,
    thumbnail = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  } = course || {};

  const instructorName = typeof instructor === 'object' ? instructor?.name : instructor;

  // Render star rating visually
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <Link to={`/courses/${_id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'box-shadow 0.15s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {/* Thumbnail */}
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f5' }}>
          <img
            src={thumbnail}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          
          {/* Title */}
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: '#1c1d1f',
            lineHeight: 1.4, display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {title}
          </h3>

          {/* Instructor */}
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.3 }}>
            {instructorName}
          </p>

          {/* Rating Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#b4690e' }}>{rating}</span>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= fullStars ? '#e59819' : 'none'}
                  color={s <= fullStars ? '#e59819' : '#d1d5db'}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#6b7280' }}>({reviewsCount.toLocaleString()})</span>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#6b7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={12} color="#6b7280" /> {duration}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Users size={12} color="#6b7280" /> {studentsCount.toLocaleString()}
            </span>
          </div>

          {/* Price */}
          <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#1c1d1f' }}>
              {isFree ? 'Free' : `$${price}`}
            </span>
            {!isFree && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 6px',
                background: '#f0fdf4', color: '#1a8754',
                border: '1px solid #bbf7d0', borderRadius: 3
              }}>
                {level}
              </span>
            )}
            {isFree && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px',
                background: '#1a8754', color: '#fff', borderRadius: 3
              }}>
                FREE
              </span>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
};

export default CourseCardPreview;
