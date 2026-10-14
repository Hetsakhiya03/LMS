import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InputField = ({ label, type, name, value, onChange, placeholder, extra }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
      {extra}
    </div>
    <input
      type={type}
      name={name}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '11px 14px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        color: '#1c1d1f',
        background: '#fff',
        outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#1a8754'}
      onBlur={e => e.target.style.borderColor = '#d1d5db'}
    />
  </div>
);

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      const role = res.data.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Incorrect email or password.');
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
            Log in to your account
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '10px 14px',
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 6, fontSize: 13, color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            extra={
              <a href="#" style={{ fontSize: 12, color: '#1a8754', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </a>
            }
          />

          {/* Demo hint */}
          <div style={{
            padding: '12px 14px', background: '#f0fdf4',
            border: '1px solid #bbf7d0', borderRadius: 6,
            fontSize: 12, color: '#374151', lineHeight: 1.7
          }}>
            <strong style={{ color: '#1a8754' }}>Demo credentials:</strong><br />
            Admin: <code>admin@learnpulse.com</code> / <code>password123</code><br />
            Instructor: <code>alex@learnpulse.com</code> / <code>password123</code><br />
            Student: <code>student1@learnpulse.com</code> / <code>password123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#6ee7b7' : '#1a8754',
              color: '#fff', border: 'none', borderRadius: 6,
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s'
            }}
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1a8754', fontWeight: 700, textDecoration: 'none' }}>
            Sign up for free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
