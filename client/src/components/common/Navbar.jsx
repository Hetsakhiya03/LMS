import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Menu, X, LogOut, LayoutDashboard, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/courses?search=${encodeURIComponent(search.trim())}`);
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }} className="sticky top-0 z-50">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 20 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#1a8754', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', letterSpacing: '-0.3px' }}>
              Learn<span style={{ color: '#1a8754' }}>Pulse</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 440 }} className="hidden md:block">
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for anything..."
                style={{
                  width: '100%',
                  padding: '9px 16px 9px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: 24,
                  fontSize: 14,
                  color: '#1c1d1f',
                  background: '#fff',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#1a8754'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: 20 }}>
            <Link to="/courses" style={{
              fontSize: 14, fontWeight: 500, color: location.pathname === '/courses' ? '#1a8754' : '#1c1d1f',
              textDecoration: 'none', whiteSpace: 'nowrap'
            }}>
              Browse Courses
            </Link>
            {isAuthenticated && (
              <Link to="/wishlist" style={{
                fontSize: 14, fontWeight: 500, color: location.pathname === '/wishlist' ? '#1a8754' : '#1c1d1f',
                textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4
              }}>
                <Heart size={14} /> Wishlist
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                {/* INSTRUCTOR ROLE: Provide BOTH Student Dashboard and Instructor Studio */}
                {user?.role === 'instructor' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => navigate('/student/dashboard')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 4,
                        border: isCurrent('/student/dashboard') ? '1px solid #1a8754' : '1px solid #e5e7eb',
                        background: isCurrent('/student/dashboard') ? '#1a8754' : '#ffffff',
                        color: isCurrent('/student/dashboard') ? '#ffffff' : '#374151',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      title="View your enrolled courses and learning progress"
                    >
                      <BookOpen size={14} /> Student View
                    </button>
                    <button
                      onClick={() => navigate('/instructor/dashboard')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 4,
                        border: isCurrent('/instructor/dashboard') ? '1px solid #1a8754' : '1px solid #e5e7eb',
                        background: isCurrent('/instructor/dashboard') ? '#1a8754' : '#ffffff',
                        color: isCurrent('/instructor/dashboard') ? '#ffffff' : '#374151',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      title="Manage your created courses and analytics"
                    >
                      <LayoutDashboard size={14} /> Instructor Studio
                    </button>
                  </div>
                )}

                {/* ADMIN ROLE */}
                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 4,
                        border: isCurrent('/admin/dashboard') ? '1px solid #1a8754' : '1px solid #e5e7eb',
                        background: isCurrent('/admin/dashboard') ? '#1a8754' : '#ffffff',
                        color: isCurrent('/admin/dashboard') ? '#ffffff' : '#374151',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <ShieldCheck size={14} /> Admin Panel
                    </button>
                    <button
                      onClick={() => navigate('/student/dashboard')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 4,
                        border: '1px solid #e5e7eb', background: '#fff',
                        color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <BookOpen size={14} /> Student View
                    </button>
                  </div>
                )}

                {/* STUDENT ROLE */}
                {user?.role === 'student' && (
                  <button
                    onClick={() => navigate('/student/dashboard')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 4,
                      border: '1px solid #1a8754', background: isCurrent('/student/dashboard') ? '#1a8754' : '#fff',
                      color: isCurrent('/student/dashboard') ? '#fff' : '#1a8754', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </button>
                )}

                {/* User Avatar Chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px', borderRadius: 6, background: '#f9fafb',
                  border: '1px solid #f3f4f6'
                }}>
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'}
                    alt={user?.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #d1fae5' }}
                  />
                  <div style={{ fontSize: 12, lineHeight: 1.25 }}>
                    <div style={{ fontWeight: 600, color: '#1c1d1f' }}>{user?.name?.split(' ')[0]}</div>
                    <div style={{ color: '#1a8754', fontSize: 10, textTransform: 'uppercase', fontWeight: 700 }}>{user?.role}</div>
                  </div>
                </div>

                {/* Sign out */}
                <button
                  onClick={logout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 11px', borderRadius: 4, border: '1px solid #e5e7eb',
                    background: '#fff', color: '#6b7280', fontSize: 13, cursor: 'pointer'
                  }}
                  title="Log out of your account"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button style={{
                    padding: '8px 16px', borderRadius: 4,
                    border: '1px solid #1c1d1f', background: '#fff',
                    color: '#1c1d1f', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                    Log in
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{
                    padding: '8px 16px', borderRadius: 4,
                    border: '1px solid #1a8754', background: '#1a8754',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer'
                  }}>
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ padding: 6, background: 'none', border: 'none', color: '#1c1d1f', marginLeft: 'auto' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e8e8e8', padding: '16px 24px 24px' }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for anything..."
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #9e9e9e', borderRadius: 4, fontSize: 14
              }}
            />
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link to="/" onClick={() => setMobileOpen(false)} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 500, color: '#1c1d1f', borderBottom: '1px solid #f5f5f5' }}>Home</Link>
            <Link to="/courses" onClick={() => setMobileOpen(false)} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 500, color: '#1c1d1f', borderBottom: '1px solid #f5f5f5' }}>Browse Courses</Link>
            {isAuthenticated && (
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} style={{ padding: '10px 4px', fontSize: 14, fontWeight: 500, color: '#1c1d1f', borderBottom: '1px solid #f5f5f5' }}>My Wishlist</Link>
            )}
            {!isAuthenticated ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', border: '1px solid #1c1d1f', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#fff', color: '#1c1d1f' }}>Log in</button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#1a8754', color: '#fff' }}>Sign up</button>
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {user?.role === 'instructor' && (
                  <>
                    <button
                      onClick={() => { navigate('/instructor/dashboard'); setMobileOpen(false); }}
                      style={{ width: '100%', padding: '10px', border: '1px solid #1a8754', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#1a8754', color: '#fff', cursor: 'pointer' }}
                    >
                      Instructor Studio
                    </button>
                    <button
                      onClick={() => { navigate('/student/dashboard'); setMobileOpen(false); }}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: 4, fontWeight: 600, fontSize: 14, background: '#fff', color: '#374151', cursor: 'pointer' }}
                    >
                      Student View Dashboard
                    </button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => { navigate('/admin/dashboard'); setMobileOpen(false); }}
                      style={{ width: '100%', padding: '10px', border: '1px solid #1a8754', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#1a8754', color: '#fff', cursor: 'pointer' }}
                    >
                      Admin Panel
                    </button>
                    <button
                      onClick={() => { navigate('/student/dashboard'); setMobileOpen(false); }}
                      style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: 4, fontWeight: 600, fontSize: 14, background: '#fff', color: '#374151', cursor: 'pointer' }}
                    >
                      Student View Dashboard
                    </button>
                  </>
                )}
                {user?.role === 'student' && (
                  <button
                    onClick={() => { navigate('/student/dashboard'); setMobileOpen(false); }}
                    style={{ width: '100%', padding: '10px', border: '1px solid #1a8754', borderRadius: 4, fontWeight: 700, fontSize: 14, background: '#1a8754', color: '#fff', cursor: 'pointer' }}
                  >
                    Student Dashboard
                  </button>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} style={{ width: '100%', padding: '10px', border: '1px solid #e8e8e8', borderRadius: 4, fontWeight: 600, fontSize: 14, background: '#fff', color: '#6b7280', cursor: 'pointer' }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
