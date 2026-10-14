import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, XCircle, Search, CheckCircle2, Award, Calendar, User, BookOpen } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const VerifyCertificatePage = () => {
  const { certificateId: paramId } = useParams();
  const [certIdInput, setCertIdInput] = useState(paramId || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyId = async (idToVerify) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const res = await api.get(`/certificates/verify/${idToVerify.trim()}`);
      if (res.success && res.verified) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Certificate ID could not be verified in the LearnPulse public database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      verifyId(paramId);
    }
  }, [paramId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyId(certIdInput);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: '#dcfce7', border: '1px solid #bbf7d0',
          color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(22,163,74,0.15)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
          Public Certificate Verification
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 460, margin: 0, lineHeight: 1.5 }}>
          Enter any LearnPulse Certificate ID below to verify its authenticity and student accreditation record.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{
        background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8,
        padding: 8, display: 'flex', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 14 }} />
          <input
            type="text"
            value={certIdInput}
            onChange={(e) => setCertIdInput(e.target.value)}
            placeholder="e.g. LP-A8K2F9-2026"
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              border: 'none', background: 'transparent',
              fontSize: 14, color: '#1c1d1f', outline: 'none'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px', borderRadius: 6,
            background: '#1a8754', color: '#ffffff',
            fontSize: 14, fontWeight: 700, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.15s'
          }}
        >
          {loading ? 'Verifying...' : 'Verify Credential'}
        </button>
      </form>

      {/* Verification Output Card */}
      {verificationResult && (
        <div style={{
          background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 12,
          padding: 32, display: 'flex', flexDirection: 'column', gap: 24,
          textAlign: 'center', boxShadow: '0 4px 16px rgba(22,163,74,0.08)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#1a8754' }}></div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 20,
            background: '#dcfce7', border: '1px solid #bbf7d0',
            color: '#15803d', fontSize: 13, fontWeight: 700,
            margin: '0 auto'
          }}>
            <CheckCircle2 size={16} color="#15803d" /> Authenticated & Valid
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certificate ID: {verificationResult.certificateId}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
              {verificationResult.studentName}
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16,
            textAlign: 'left', paddingTop: 16, borderTop: '1px solid #f3f4f6'
          }}>
            <div style={{ padding: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={14} color="#1a8754" /> Course Completed
              </span>
              <div style={{ fontWeight: 700, color: '#1c1d1f', fontSize: 14 }}>
                {verificationResult.courseTitle}
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} color="#1a8754" /> Instructor
              </span>
              <div style={{ fontWeight: 700, color: '#1c1d1f', fontSize: 14 }}>
                {verificationResult.instructorName}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Calendar size={14} /> Issued on {new Date(verificationResult.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: 24, borderRadius: 8, background: '#fef2f2',
          border: '1px solid #fecaca', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
        }}>
          <XCircle size={32} color="#dc2626" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991b1b', margin: 0 }}>Verification Failed</h3>
          <p style={{ fontSize: 13, color: '#b91c1c', margin: 0 }}>{error}</p>
        </div>
      )}

    </div>
  );
};

export default VerifyCertificatePage;
