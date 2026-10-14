import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, Users, Award, Star } from 'lucide-react';

/* ── Static demo data ─────────────────────────────────────────────── */
const COURSES = [
  {
    id: 1,
    title: 'The Complete JavaScript Course 2024: From Zero to Expert!',
    instructor: 'Jonas Schmedtmann',
    category: 'Web Development',
    level: 'All Levels',
    rating: 4.7,
    reviewsCount: 183456,
    studentsCount: 832400,
    duration: '68.5 total hours',
    price: 19.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Python Bootcamp: Go from Zero to Hero in Python 3',
    instructor: 'Jose Portilla',
    category: 'Programming',
    level: 'Beginner',
    rating: 4.6,
    reviewsCount: 506230,
    studentsCount: 1920000,
    duration: '22 total hours',
    price: 17.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Machine Learning A-Z™: AI, Python & R in Data Science',
    instructor: 'Kirill Eremenko',
    category: 'Data Science',
    level: 'Intermediate',
    rating: 4.5,
    reviewsCount: 178200,
    studentsCount: 920000,
    duration: '43 total hours',
    price: 0,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'AWS Certified Solutions Architect - Associate 2024',
    instructor: 'Stephane Maarek',
    category: 'Cloud Computing',
    level: 'Intermediate',
    rating: 4.7,
    reviewsCount: 212300,
    studentsCount: 580000,
    duration: '26.5 total hours',
    price: 24.99,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  },
];

const CATEGORIES = ['Web Development', 'Data Science', 'Machine Learning', 'Graphic Design', 'Business', 'Photography'];

const TOPICS = [
  { name: 'ChatGPT', learners: '4M+ learners' },
  { name: 'Python', learners: '47.4M+ learners' },
  { name: 'Excel', learners: '38.2M+ learners' },
  { name: 'Web Development', learners: '14.3M+ learners' },
  { name: 'JavaScript', learners: '17.3M+ learners' },
  { name: 'Data Science', learners: '7.2M+ learners' },
  { name: 'React', learners: '7.5M+ learners' },
  { name: 'SQL', learners: '8.5M+ learners' },
];

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13}
          fill={s <= full ? '#e59819' : 'none'}
          color={s <= full ? '#e59819' : '#d1d5db'}
        />
      ))}
    </span>
  );
};

const HomePage = () => {
  const [activeCat, setActiveCat] = useState('Web Development');

  return (
    <div style={{ background: '#fff', color: '#1c1d1f' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 48, alignItems: 'center', padding: '60px 0',
          }} className="hero-grid">
            
            {/* Left content */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                #1 Online Learning Platform
              </p>
              <h1 style={{ fontSize: 40, fontWeight: 800, color: '#1c1d1f', lineHeight: 1.2, marginBottom: 20 }}>
                Learn the skills you<br />need to succeed
              </h1>
              <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Access over 180,000 online courses from top instructors. Join 12 million learners worldwide and start building real skills today.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/courses">
                  <button style={{
                    padding: '14px 28px', borderRadius: 4,
                    background: '#1a8754', color: '#fff',
                    fontSize: 15, fontWeight: 700, border: 'none',
                    letterSpacing: '0.01em'
                  }}>
                    Start learning — it's free
                  </button>
                </Link>
                <Link to="/courses">
                  <button style={{
                    padding: '14px 28px', borderRadius: 4,
                    background: '#fff', color: '#1c1d1f',
                    fontSize: 15, fontWeight: 700,
                    border: '1px solid #1c1d1f'
                  }}>
                    Browse all courses
                  </button>
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
                {[
                  { num: '12M+', txt: 'Students' },
                  { num: '180+', txt: 'Courses' },
                  { num: '98%', txt: 'Completion rate' },
                ].map(s => (
                  <div key={s.num}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1a8754' }}>{s.num}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{s.txt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: hero image */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=85"
                alt="Students learning"
                style={{ width: '100%', borderRadius: 8, display: 'block', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
              />
              {/* Floating card */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: '#fff', borderRadius: 8, padding: '14px 18px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ width: 40, height: 40, background: '#f0fdf4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="#1a8754" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1d1f' }}>Certificate on completion</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Publicly verifiable credential</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ───────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid #e8e8e8', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>Trusted by learners at</p>
          {['Google', 'Microsoft', 'Amazon', 'Spotify', 'Samsung', 'Netflix'].map(name => (
            <span key={name} style={{ fontSize: 15, fontWeight: 700, color: '#9ca3af', letterSpacing: '-0.02em' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOPICS ──────────────────────────────── */}
      <section style={{ padding: '60px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, color: '#1c1d1f' }}>
          A broad selection of courses
        </h2>
        <p style={{ fontSize: 15, color: '#4b5563', marginBottom: 32, maxWidth: 560 }}>
          Choose from over 180 courses with new additions published every month.
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e8e8', marginBottom: 32, overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                padding: '12px 20px', fontSize: 14,
                border: 'none', background: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', color: activeCat === cat ? '#1c1d1f' : '#6b7280',
                borderBottom: activeCat === cat ? '2px solid #1c1d1f' : '2px solid transparent',
                fontWeight: activeCat === cat ? 700 : 400,
                transition: 'color 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {COURSES.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden',
                  background: '#fff', transition: 'box-shadow 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f5' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1c1d1f', lineHeight: 1.35,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{course.instructor}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#b4690e' }}>{course.rating}</span>
                    <StarRating rating={course.rating} />
                    <span style={{ fontSize: 11, color: '#6b7280' }}>({course.reviewsCount.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1c1d1f' }}>
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </span>
                    {course.isFree && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', background: '#1a8754', color: '#fff', borderRadius: 3 }}>FREE</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <Link to="/courses">
            <button style={{
              padding: '12px 24px', border: '1px solid #1c1d1f',
              borderRadius: 4, background: '#fff', color: '#1c1d1f',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
              Explore all courses <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── TOP TOPICS ────────────────────────────────────── */}
      <section style={{ background: '#f9f9f9', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: '#1c1d1f' }}>Most popular topics</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>
            Join millions of learners already on LearnPulse
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {TOPICS.map(topic => (
              <Link key={topic.name} to="/courses">
                <div
                  style={{
                    padding: '16px', border: '1px solid #e8e8e8', borderRadius: 4,
                    background: '#fff', cursor: 'pointer', transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1a8754'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1c1d1f', marginBottom: 4 }}>{topic.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{topic.learners}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LEARNPULSE ───────────────────────────────── */}
      <section style={{ padding: '60px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#1c1d1f', lineHeight: 1.25, marginBottom: 24 }}>
              Learn on your schedule.<br />Grow at your pace.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { title: 'Learn from industry experts', desc: 'All instructors are professionals with real-world experience.' },
                { title: 'Learn anywhere, anytime', desc: 'Stream lectures from any device. Download for offline access.' },
                { title: 'Earn a verified certificate', desc: 'Every completed course issues a publicly verifiable certificate.' },
                { title: 'Lifetime access', desc: 'Buy once, access forever. Go at your own pace.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="#1a8754" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1d1f', marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=85"
              alt="Student studying"
              style={{ width: '100%', borderRadius: 8, display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
          </div>
        </div>
      </section>

      {/* ── ROLES CTA ────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderTop: '1px solid #d1fae5', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', marginBottom: 8 }}>
            Built for everyone in education
          </h2>
          <p style={{ fontSize: 14, color: '#4b5563', marginBottom: 40 }}>
            Whether you're here to learn, teach, or manage — LearnPulse has a workspace for you.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                title: 'For Students',
                desc: 'Enroll in courses, watch HD video lectures, take quizzes, and earn certificates.',
                link: '/register',
                label: 'Start learning today',
                bg: '#fff',
                border: '#d1fae5',
              },
              {
                title: 'For Instructors',
                desc: 'Create your course, upload lectures, build quizzes, and grow your student base.',
                link: '/register',
                label: 'Start teaching today',
                bg: '#fff',
                border: '#ddd6fe',
              },
              {
                title: 'For Administrators',
                desc: 'Manage users, approve courses, and view platform-wide analytics and metrics.',
                link: '/login',
                label: 'Access admin panel',
                bg: '#fff',
                border: '#bae6fd',
              },
            ].map(card => (
              <div key={card.title} style={{
                background: card.bg, border: `1px solid ${card.border}`,
                borderRadius: 8, padding: 28
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 20 }}>{card.desc}</p>
                <Link to={card.link}>
                  <button style={{
                    padding: '10px 20px', borderRadius: 4, border: '1px solid #1a8754',
                    background: '#fff', color: '#1a8754', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', width: '100%'
                  }}>
                    {card.label} →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
