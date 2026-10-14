import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';
import api from '../services/api';

const CourseBuilderPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    requirements: [''],
    learningObjectives: [''],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, field) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setError('Please complete title, description, and category fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/courses', {
        ...formData,
        requirements: formData.requirements.filter(Boolean),
        learningObjectives: formData.learningObjectives.filter(Boolean),
      });

      if (res.success) {
        alert('🎉 Course created successfully!');
        navigate('/instructor/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => navigate('/instructor/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#4b5563',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              width: 'fit-content'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1c1d1f'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
          >
            <ArrowLeft size={16} /> Back to Studio
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Course Builder Studio
            </span>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
              Create New Masterclass
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '14px 18px',
            borderRadius: 6,
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: 13,
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Card 1: Basic Information */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', margin: 0, borderBottom: '1px solid #f3f4f6', paddingBottom: 12 }}>
              1. Basic Information
            </h2>

            {/* Course Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Course Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Master React & Redux Toolkit Complete Guide"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  color: '#1c1d1f',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Course Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Course Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a comprehensive summary of what students will master in this course..."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  color: '#1c1d1f',
                  background: '#ffffff',
                  outline: 'none',
                  lineHeight: 1.5
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* 3 Columns: Category, Level, Price */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    color: '#1c1d1f',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Difficulty Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    color: '#1c1d1f',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Price (USD, 0 for free)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    color: '#1c1d1f',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Thumbnail Image URL</label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  color: '#1c1d1f',
                  background: '#ffffff',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* Card 2: What Students Will Learn */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
                2. What Students Will Learn
              </h2>

              <button
                type="button"
                onClick={() => addArrayItem('learningObjectives')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 4,
                  background: '#ecfdf5',
                  border: '1px solid #d1fae5',
                  color: '#1a8754',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Objective
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {formData.learningObjectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleArrayChange(i, e.target.value, 'learningObjectives')}
                    placeholder={`Objective ${i + 1} (e.g. Build production-ready React applications)`}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                      fontSize: 13,
                      color: '#1c1d1f',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1a8754'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  {formData.learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(i, 'learningObjectives')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 4,
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove Objective"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
              style={{
                padding: '12px 24px',
                borderRadius: 4,
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#1c1d1f',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 4,
                background: '#1a8754',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(26,135,84,0.3)',
                transition: 'background 0.15s'
              }}
            >
              <Sparkles size={16} />
              {loading ? 'Publishing...' : 'Publish Course'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CourseBuilderPage;
