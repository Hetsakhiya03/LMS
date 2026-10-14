import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}`);
        if (res.success) {
          setQuiz(res.data);
          setTimeLeft((res.data.timeLimitMinutes || 15) * 60);
        }
      } catch (err) {
        console.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, result]);

  const handleOptionSelect = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || submitting || result) return;
    setSubmitting(true);

    const formattedAnswers = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1,
    }));

    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
      });

      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to process quiz submission');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading quiz questions...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Quiz Unavailable</h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Quiz Header Bar */}
      <div style={{
        background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8754', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Assessment Engine
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
            {quiz.title}
          </h1>
        </div>

        {!result && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 20, background: '#f0fdf4',
            border: '1px solid #d1fae5', fontSize: 14, fontWeight: 700, color: '#15803d'
          }}>
            <Clock size={16} color="#15803d" /> Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* QUIZ RESULTS VIEW */}
      {result ? (
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: 32, display: 'flex', flexDirection: 'column', gap: 24,
          textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: result.passed ? '#dcfce7' : '#fee2e2',
            color: result.passed ? '#15803d' : '#dc2626',
            border: `1px solid ${result.passed ? '#bbf7d0' : '#fecaca'}`
          }}>
            {result.passed ? <Award size={36} /> : <XCircle size={36} />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              display: 'inline-block', margin: '0 auto', padding: '4px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
              background: result.passed ? '#dcfce7' : '#fee2e2',
              color: result.passed ? '#15803d' : '#991b1b'
            }}>
              {result.passed ? 'PASSED ✓' : 'NEEDS IMPROVEMENT'}
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1c1d1f', margin: 0 }}>
              Score: {result.score} / {result.totalMarks}
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              Passing Score Required: {result.passingScore}% ({result.percentage}% Achieved)
            </p>
          </div>

          {/* Detailed Question Review List */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', margin: 0 }}>Question Breakdown</h3>
            {result.details?.map((detail, idx) => (
              <div key={idx} style={{
                padding: 16, borderRadius: 8, background: '#f9fafb',
                border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontWeight: 600, color: '#1c1d1f', fontSize: 14 }}>
                    {idx + 1}. {detail.questionText}
                  </div>
                  {detail.isCorrect ? (
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#15803d', fontWeight: 700, flexShrink: 0 }}>
                      Correct +5
                    </span>
                  ) : (
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', fontWeight: 700, flexShrink: 0 }}>
                      Incorrect
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, color: '#4b5563' }}>
                  <div>Your Answer: <strong style={{ color: '#1c1d1f' }}>{detail.selectedOption >= 0 ? detail.options[detail.selectedOption] : 'None'}</strong></div>
                  <div>Correct Answer: <strong style={{ color: '#15803d' }}>{detail.options[detail.correctAnswerIndex]}</strong></div>
                  {detail.explanation && <div style={{ color: '#1a8754', paddingTop: 4, fontStyle: 'italic' }}>Explanation: {detail.explanation}</div>}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 24px', borderRadius: 4, background: '#1a8754', color: '#fff',
              fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', margin: '0 auto'
            }}
          >
            Return to Course
          </button>
        </div>
      ) : (
        /* QUIZ TAKING INTERFACE */
        <div style={{
          background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8,
          padding: 32, display: 'flex', flexDirection: 'column', gap: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          
          {/* Question Stepper Indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 13, color: '#6b7280', paddingBottom: 12, borderBottom: '1px solid #e5e7eb'
          }}>
            <span>Question {currentQIndex + 1} of {quiz.questions.length}</span>
            <span style={{ fontWeight: 600, color: '#1c1d1f' }}>Marks: {currentQ.marks || 5}</span>
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1c1d1f', margin: 0, lineHeight: 1.5 }}>
            {currentQ.questionText}
          </h3>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentQ.options?.map((opt, oIdx) => {
              const isSelected = answers[currentQ._id] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleOptionSelect(currentQ._id, oIdx)}
                  style={{
                    width: '100%', padding: '14px 18px', borderRadius: 6,
                    textAlign: 'left', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', fontSize: 14,
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    border: isSelected ? '2px solid #1a8754' : '1px solid #d1d5db',
                    color: isSelected ? '#15803d' : '#1c1d1f',
                    fontWeight: isSelected ? 600 : 400,
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{opt}</span>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: isSelected ? '2px solid #1a8754' : '2px solid #d1d5db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? '#1a8754' : 'transparent', flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 20, borderTop: '1px solid #e5e7eb'
          }}>
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((i) => i - 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: 4, background: '#ffffff',
                border: '1px solid #d1d5db', color: currentQIndex === 0 ? '#9ca3af' : '#374151',
                fontSize: 14, fontWeight: 600, cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentQIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex((i) => i + 1)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 4, background: '#1a8754',
                  border: 'none', color: '#ffffff', fontSize: 14, fontWeight: 700, cursor: 'pointer'
                }}
              >
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 22px', borderRadius: 4, background: '#1a8754',
                  border: 'none', color: '#ffffff', fontSize: 14, fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
                }}
              >
                <Sparkles size={16} /> {submitting ? 'Evaluating...' : 'Submit Quiz'}
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default QuizPage;
