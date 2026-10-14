import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Printer, ArrowLeft, GraduationCap, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CertificateViewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [certificate, setCertificate] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await api.get(`/certificates/${courseId}`);
        if (res.success && res.data) {
          setCertificate(res.data);
        }
      } catch (err) {
        console.warn('Certificate query note:', err.message);
      } finally {
        // Also fetch course if needed to ensure course title and instructor headline
        try {
          const cRes = await api.get(`/courses/${courseId}`);
          if (cRes.success) {
            setCourse(cRes.data);
          }
        } catch (cErr) {
          // ignore
        }
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Loader2 size={36} color="#1a8754" className="animate-spin" />
        <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Generating certificate preview...</p>
      </div>
    );
  }

  // Consistent student name from Certificate record or currently logged-in user
  const studentName = certificate?.student?.name || user?.name || 'Valued Learner';
  const courseTitle = certificate?.course?.title || course?.title || 'Professional Masterclass';
  const instructorName = certificate?.instructor?.name || course?.instructor?.name || 'Lead Instructor';
  const instructorHeadline = certificate?.instructor?.headline || course?.instructor?.headline || 'Certified Lead Instructor';
  const certId = certificate?.certificateId || `LP-${(courseId || 'CERT').substring(0, 6).toUpperCase()}-${Date.now().toString(36).substring(3).toUpperCase()}`;
  const issueDate = certificate?.issueDate ? new Date(certificate.issueDate) : new Date();

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Control Action Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 4, background: '#f3f4f6',
              border: '1px solid #e5e7eb', color: '#374151', fontSize: 13,
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1c1d1f', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={20} color="#1a8754" /> Certificate of Completion
            </h1>
            <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>ID: {certId}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 4, background: '#1a8754',
              color: '#ffffff', fontSize: 13, fontWeight: 700, border: 'none',
              cursor: 'pointer', boxShadow: '0 2px 6px rgba(26,135,84,0.3)'
            }}
          >
            <Printer size={15} /> Print / Download PDF
          </button>
          <Link to={`/verify-certificate/${certId}`} style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 4, background: '#ffffff',
              color: '#1a8754', fontSize: 13, fontWeight: 700, border: '1px solid #1a8754',
              cursor: 'pointer'
            }}>
              <ShieldCheck size={15} /> Public Verification
            </button>
          </Link>
        </div>
      </div>

      {/* CERTIFICATE CANVAS FRAME */}
      <div style={{
        position: 'relative', padding: '48px 40px', background: '#ffffff',
        border: '8px solid #d1fae5', outline: '2px solid #1a8754', outlineOffset: -12,
        borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'center'
      }}>
        
        {/* Certificate Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8,
              background: '#1a8754', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1c1d1f', letterSpacing: '-0.3px' }}>
                Learn<span style={{ color: '#1a8754' }}>Pulse</span>
              </div>
              <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700 }}>
                Official Credential
              </span>
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            background: '#dcfce7', border: '1px solid #bbf7d0',
            color: '#15803d', fontSize: 12, fontWeight: 700
          }}>
            <ShieldCheck size={16} /> VERIFIED ACADEMIC CREDENTIAL
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
          <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a8754', fontWeight: 800 }}>
            Certificate of Completion
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>This document certifies that</p>

          {/* Student Username displayed boldly */}
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#1c1d1f', margin: 0, letterSpacing: '-0.5px' }}>
            {studentName}
          </h2>

          <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
            has successfully completed all lectures, practical assignments, and comprehensive assessments for the masterclass
          </p>

          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1a8754', margin: 0 }}>
            "{courseTitle}"
          </h3>
        </div>

        {/* Certificate Footer Details & Signatures */}
        <div style={{
          paddingTop: 24, borderTop: '1px solid #e5e7eb',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
          textAlign: 'center', fontSize: 13
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 800, color: '#1c1d1f', fontSize: 15 }}>{instructorName}</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>{instructorHeadline}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 800, color: '#1c1d1f', fontSize: 15 }}>Issue Date</div>
            <div style={{ color: '#4b5563', fontSize: 12 }}>{issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 800, color: '#1c1d1f', fontSize: 15 }}>Certificate ID</div>
            <div style={{ fontFamily: 'monospace', color: '#1a8754', fontWeight: 700, fontSize: 13 }}>{certId}</div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CertificateViewPage;
