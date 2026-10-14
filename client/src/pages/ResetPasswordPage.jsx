import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuthFromToken } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.success) {
        setSuccess(true);
        // Auto-redirect to dashboard after 2.5 seconds
        setTimeout(() => {
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
          navigate('/dashboard');
        }, 2500);
      }
    } catch (err) {
      setError(err.message || 'Reset link is invalid or has expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 16px', background: '#f9f9f9'
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 8, padding: '40px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: '#1a8754', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1c1d1f' }}>
              Learn<span style={{ color: '#1a8754' }}>Pulse</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', marginBottom: 6 }}>
            Set a new password
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          /* Success State */
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#ecfdf5', border: '1px solid #d1fae5',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={32} color="#1a8754" />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1c1d1f', marginBottom: 8 }}>Password reset! 🎉</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                Your password has been updated. Redirecting you to your dashboard...
              </p>
            </div>
            <div style={{
              width: '100%', height: 4, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', background: '#1a8754', borderRadius: 99,
                animation: 'progress 2.5s linear forwards'
              }} />
            </div>
          </div>
        ) : (
          /* Form State */
          <>
            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 6, fontSize: 13, color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={{
                      width: '100%', padding: '11px 44px 11px 40px',
                      border: '1px solid #d1d5db', borderRadius: 6,
                      fontSize: 14, color: '#1c1d1f', background: '#fff', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a8754'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    style={{
                      width: '100%', padding: '11px 14px 11px 40px',
                      border: `1px solid ${confirmPassword && confirmPassword !== password ? '#fca5a5' : '#d1d5db'}`,
                      borderRadius: 6, fontSize: 14, color: '#1c1d1f', background: '#fff', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a8754'}
                    onBlur={e => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? '#fca5a5' : '#d1d5db'}
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <span style={{ fontSize: 12, color: '#dc2626' }}>Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: loading ? '#6ee7b7' : '#1a8754',
                  color: '#fff', border: 'none', borderRadius: 6,
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
              Remembered it?{' '}
              <Link to="/login" style={{ color: '#1a8754', fontWeight: 700, textDecoration: 'none' }}>
                Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
