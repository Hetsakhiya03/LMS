import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Star, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const CourseBrowsePage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOption, setSortOption] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fallbackThumbnail = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80';

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLevel !== 'All') params.append('level', selectedLevel);
      if (priceFilter !== 'all') params.append('priceType', priceFilter);
      if (sortOption) params.append('sort', sortOption);
      params.append('page', page);
      params.append('limit', 8);

      const res = await api.get(`/courses?${params.toString()}`);
      if (res.success) {
        setCourses(res.data || []);
        setTotalPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedLevel, priceFilter, sortOption, page]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Marketplace Catalog
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0, lineHeight: 1.2 }}>
          Explore Professional Courses
        </h1>
        <p style={{ fontSize: 14, color: '#4b5563', margin: 0, maxWidth: 600, lineHeight: 1.6 }}>
          Discover top-tier educational courses. Filter by category, difficulty level, and price to find your next skill.
        </p>
      </div>

      {/* ── Search & Filter Control Bar ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 460 }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, instructor, skill..."
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              outline: 'none',
              color: '#1c1d1f',
              background: '#ffffff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1a8754'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
            style={{
              padding: '9px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => { setPriceFilter(e.target.value); setPage(1); }}
            style={{
              padding: '9px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Prices</option>
            <option value="free">Free Courses</option>
            <option value="paid">Paid Courses</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '9px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="latest">Sort: Newest First</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Category Pills Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 6,
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => { setSelectedCategory('All'); setPage(1); }}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            border: selectedCategory === 'All' ? '1px solid #1a8754' : '1px solid #e5e7eb',
            background: selectedCategory === 'All' ? '#1a8754' : '#ffffff',
            color: selectedCategory === 'All' ? '#ffffff' : '#4b5563',
            boxShadow: selectedCategory === 'All' ? '0 1px 3px rgba(26,135,84,0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          All Categories
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
              style={{
                padding: '7px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: isSelected ? '1px solid #1a8754' : '1px solid #e5e7eb',
                background: isSelected ? '#1a8754' : '#ffffff',
                color: isSelected ? '#ffffff' : '#4b5563',
                boxShadow: isSelected ? '0 1px 3px rgba(26,135,84,0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ── Courses Grid ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <Loader2 size={36} color="#1a8754" className="animate-spin" />
          <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Fetching courses...</span>
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
          gap: 16
        }}>
          <BookOpen size={40} color="#1a8754" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 420 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>No Courses Found</h3>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0 }}>Try refining your search query or resetting filters.</p>
          </div>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); setPriceFilter('all'); }}
            style={{
              padding: '10px 20px',
              borderRadius: 4,
              background: '#1a8754',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Thumbnail Container */}
              <div style={{ position: 'relative', width: '100%', height: 165, background: '#f3f4f6', overflow: 'hidden' }}>
                <img
                  src={course.thumbnail || fallbackThumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackThumbnail;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                
                {/* Category badge */}
                <span style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1c1d1f',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }}>
                  {course.category?.name || 'Education'}
                </span>

                {/* Price badge */}
                <span style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 800,
                  background: course.isFree ? '#dcfce7' : '#1a8754',
                  color: course.isFree ? '#15803d' : '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }}>
                  {course.isFree ? 'FREE' : `$${course.price}`}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Rating & Level */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1c1d1f', fontWeight: 700 }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      {course.averageRating || 5.0}
                      <span style={{ color: '#6b7280', fontWeight: 400 }}>({course.ratingsCount || 0})</span>
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#f3f4f6', color: '#4b5563', fontSize: 11, fontWeight: 600 }}>
                      {course.level || 'All Levels'}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#1c1d1f',
                    margin: 0,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 40
                  }}>
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                    By <span style={{ color: '#374151', fontWeight: 600 }}>{course.instructor?.name || 'Instructor'}</span>
                  </p>
                </div>

                {/* Footer Meta & Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: '#6b7280',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: 10
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} color="#1a8754" /> {course.duration || '12 Hours'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={13} color="#6b7280" /> {course.totalStudents || 0}
                    </span>
                  </div>

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
                      gap: 6,
                      transition: 'background 0.15s'
                    }}>
                      View Course <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#374151',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1
            }}
          >
            Previous
          </button>
          
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>
          
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#374151',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.4 : 1
            }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default CourseBrowsePage;
