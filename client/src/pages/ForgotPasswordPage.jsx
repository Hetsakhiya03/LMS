import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
            Forgot your password?
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
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
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1c1d1f', marginBottom: 8 }}>Check your inbox!</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                The link expires in <strong>15 minutes</strong>.
              </p>
            </div>
            <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
              <button style={{
                width: '100%', padding: '13px', background: '#1a8754',
                color: '#fff', border: 'none', borderRadius: 6,
                fontSize: 15, fontWeight: 700, cursor: 'pointer'
              }}>
                Back to Login
              </button>
            </Link>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%', padding: '11px 14px 11px 40px',
                      border: '1px solid #d1d5db', borderRadius: 6,
                      fontSize: 14, color: '#1c1d1f', background: '#fff', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a8754'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
              <Link to="/login" style={{ color: '#1a8754', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
