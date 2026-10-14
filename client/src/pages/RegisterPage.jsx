import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InputField = ({ label, type, name, value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</label>
    <input
      type={type}
      name={name}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '11px 14px',
        border: '1px solid #d1d5db', borderRadius: 6,
        fontSize: 14, color: '#1c1d1f', background: '#fff',
        outline: 'none', transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = '#1a8754'}
      onBlur={e => e.target.style.borderColor = '#d1d5db'}
    />
  </div>
);

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();

  const initialRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student';
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await registerAuth({ name: formData.fullName, email: formData.email, password: formData.password, role });
      setLoading(false);
      if (res.data.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '40px 16px', background: '#f9f9f9'
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 8, padding: '40px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: '#1a8754', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1c1d1f' }}>
              Learn<span style={{ color: '#1a8754' }}>Pulse</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f', marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            Join LearnPulse to start learning or teaching today.
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { value: 'student', label: 'Student', sub: 'Enroll & learn', Icon: BookOpen },
            { value: 'instructor', label: 'Instructor', sub: 'Build & publish', Icon: Layers },
          ].map(({ value, label, sub, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 6, cursor: 'pointer',
                border: role === value ? '2px solid #1a8754' : '1px solid #e5e7eb',
                background: role === value ? '#f0fdf4' : '#fff',
                transition: 'all 0.15s'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: role === value ? '#1a8754' : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} color={role === value ? '#fff' : '#9ca3af'} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1d1f' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{sub}</div>
              </div>
            </button>
          ))}
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InputField label="Full name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
          <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
            <InputField label="Confirm password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#6ee7b7' : '#1a8754',
              color: '#fff', border: 'none', borderRadius: 6,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4
            }}
          >
            {loading ? 'Creating account...' : `Create ${role === 'instructor' ? 'instructor' : 'student'} account`}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a8754', fontWeight: 700, textDecoration: 'none' }}>
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
