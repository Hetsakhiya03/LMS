import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fallbackThumbnail = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        if (res.success) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course for checkout');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      // 1. Create checkout session
      const sessionRes = await api.post('/payments/checkout-session', { courseId });
      
      // 2. Verify backend payment
      const verifyRes = await api.post('/payments/verify', {
        courseId,
        paymentId: sessionRes.data.orderId,
      });

      if (verifyRes.success) {
        alert('🎉 Payment verified! Enrollment complete.');
        navigate(`/learning/${courseId}`);
      }
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Preparing secure checkout...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px', gap: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1c1d1f' }}>Course Not Found</h2>
        <button
          onClick={() => navigate('/courses')}
          style={{ padding: '10px 20px', borderRadius: 4, background: '#1a8754', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
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
          <ArrowLeft size={16} /> Back to Details
        </button>

        {/* Checkout Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24
        }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', pb: 16, paddingBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a8754' }}>
                Secure Checkout
              </span>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
                Order Summary
              </h1>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: 12,
              fontWeight: 700
            }}>
              <Lock size={13} color="#16a34a" /> 256-Bit SSL Encrypted
            </div>
          </div>

          {/* Course Summary Box */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #d1fae5',
            borderRadius: 8,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <img
              src={course.thumbnail || fallbackThumbnail}
              alt={course.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackThumbnail;
              }}
              style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1c1d1f', margin: 0, lineHeight: 1.35 }}>
                {course.title}
              </h3>
              <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>
                Instructor: <strong style={{ color: '#1c1d1f' }}>{course.instructor?.name || 'LearnPulse Instructor'}</strong>
              </p>
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a8754', flexShrink: 0 }}>
              ${course.price}
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '16px 0',
            borderTop: '1px solid #f3f4f6',
            borderBottom: '1px solid #f3f4f6',
            fontSize: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>Course Subtotal</span>
              <span style={{ fontWeight: 600, color: '#1c1d1f' }}>${course.price}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
              <span>Platform Service Fee</span>
              <span style={{ fontWeight: 700, color: '#1a8754' }}>$0.00 (FREE)</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTop: '1px solid #e5e7eb',
              fontSize: 16
            }}>
              <span style={{ fontWeight: 800, color: '#1c1d1f' }}>Total Payable Amount</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#1a8754' }}>${course.price}</span>
            </div>
          </div>

          {/* Payment Gateway Box */}
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: '#ecfdf5',
              border: '1px solid #d1fae5',
              color: '#1a8754',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CreditCard size={22} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1c1d1f' }}>
                Stripe / Razorpay Instant Checkout
              </span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                Secure sandbox transaction. Immediate full course & certificate access upon completion.
              </span>
            </div>
          </div>

          {/* Complete Payment Button */}
          <button
            disabled={processing}
            onClick={handleProcessPayment}
            style={{
              width: '100%',
              padding: '15px 24px',
              borderRadius: 4,
              background: '#1a8754',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              cursor: processing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(26,135,84,0.3)',
              transition: 'background 0.15s'
            }}
          >
            <Sparkles size={18} />
            {processing ? 'Verifying Gateway Response...' : `Complete Payment of $${course.price}`}
          </button>

          {/* Guarantee / Trust Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
            <ShieldCheck size={16} color="#1a8754" /> 30-Day Money-Back Guarantee • Full Lifetime Access
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
