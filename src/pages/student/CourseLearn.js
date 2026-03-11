import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function CourseLearn() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    API.get(`/courses/student/progress/${courseId}`).then(r => {
      setEnrollment(r.data.enrollment);
      const firstLesson = r.data.enrollment?.Course?.Modules?.[0]?.Lessons?.[0];
      if (firstLesson) setActiveLesson(firstLesson);
      setLoading(false);
    }).catch(() => { navigate('/my-courses'); });
    API.get(`/quiz/${courseId}`).then(r => setQuiz(r.data.quiz)).catch(() => {});
  }, [courseId]);

  const completedLessons = JSON.parse(enrollment?.completedLessons || '[]');

  const markComplete = async (lessonId) => {
    try {
      const r = await API.put('/courses/student/lesson/complete', { courseId: parseInt(courseId), lessonId });
      setEnrollment(prev => ({ ...prev, progress: r.data.progress, completedLessons: JSON.stringify(r.data.completedLessons) }));
    } catch {}
  };

  const submitQuiz = async () => {
    try {
      const r = await API.post(`/quiz/${quiz.id}/submit`, { answers });
      setQuizResult(r.data);
    } catch {}
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>;

  const course = enrollment?.Course;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 300 : 0, transition: 'width 0.3s', overflow: 'hidden', background: '#1e293b', borderRight: '1px solid #334155', flexShrink: 0 }}>
        <div style={{ width: 300, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button onClick={() => navigate('/my-courses')} style={{ background: 'none', color: '#94a3b8', fontSize: 18 }}><i className="fas fa-arrow-left"></i></button>
            <h2 style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans' }}>{course?.title}</h2>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>Progress</span>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{Math.round(enrollment?.progress || 0)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${enrollment?.progress || 0}%` }}></div></div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            {course?.Modules?.map((module, mi) => (
              <div key={module.id} style={{ marginBottom: 16 }}>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, padding: '0 4px' }}>Module {mi + 1}: {module.title}</div>
                {module.Lessons?.map(lesson => {
                  const done = completedLessons.includes(lesson.id);
                  const active = activeLesson?.id === lesson.id;
                  return (
                    <button key={lesson.id} onClick={() => { setActiveLesson(lesson); setShowQuiz(false); setQuizResult(null); }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                      background: active ? '#2563eb' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.2s'
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${done ? '#16a34a' : active ? 'white' : '#475569'}`, background: done ? '#16a34a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {done && <i className="fas fa-check" style={{ fontSize: 9, color: 'white' }}></i>}
                      </div>
                      <span style={{ fontSize: 13, color: active ? 'white' : done ? '#94a3b8' : '#cbd5e1', lineHeight: 1.3 }}>{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
            {quiz && (
              <button onClick={() => { setShowQuiz(true); setActiveLesson(null); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 8,
                background: showQuiz ? '#7c3aed' : 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', marginTop: 8
              }}>
                <i className="fas fa-question-circle" style={{ color: '#a78bfa', fontSize: 16 }}></i>
                <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Final Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ background: '#1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #334155' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', color: '#94a3b8', fontSize: 18 }}><i className={`fas fa-${sidebarOpen ? 'indent' : 'outdent'}`}></i></button>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{showQuiz ? 'Final Quiz' : activeLesson?.title}</span>
        </div>

        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {showQuiz ? (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <div style={{ background: '#1e293b', borderRadius: 16, padding: 32 }}>
                <h2 style={{ color: 'white', fontSize: 24, marginBottom: 8 }}>{quiz?.title}</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>Passing score: {quiz?.passingScore}%</p>
                {quizResult ? (
                  <div style={{ textAlign: 'center', padding: 32 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>{quizResult.passed ? '🎉' : '😔'}</div>
                    <h3 style={{ color: quizResult.passed ? '#4ade80' : '#f87171', fontSize: 28, marginBottom: 8 }}>{quizResult.passed ? 'Congratulations!' : 'Not Passed'}</h3>
                    <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 8 }}>Score: {Math.round(quizResult.score)}%</p>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>{quizResult.correct} / {quizResult.total} correct answers</p>
                    {quizResult.passed && <p style={{ color: '#4ade80', marginTop: 16, fontSize: 14 }}>Your certificate has been issued! 🎓</p>}
                    {!quizResult.passed && <button onClick={() => { setQuizResult(null); setAnswers({}); }} className="btn btn-primary" style={{ marginTop: 20 }}>Try Again</button>}
                  </div>
                ) : (
                  <>
                    {quiz?.QuizQuestions?.map((q, qi) => (
                      <div key={q.id} style={{ marginBottom: 24, background: '#0f172a', borderRadius: 12, padding: 20 }}>
                        <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{qi + 1}. {q.question}</p>
                        {['A','B','C','D'].map(opt => (
                          <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} style={{
                            display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 8, marginBottom: 8,
                            background: answers[q.id] === opt ? '#2563eb' : '#1e293b', border: `1px solid ${answers[q.id] === opt ? '#2563eb' : '#334155'}`,
                            color: answers[q.id] === opt ? 'white' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontSize: 14, transition: 'all 0.2s'
                          }}>
                            <span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${answers[q.id] === opt ? 'white' : '#475569'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{opt}</span>
                            {q[`option${opt}`]}
                          </button>
                        ))}
                      </div>
                    ))}
                    <button onClick={submitQuiz} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={Object.keys(answers).length < quiz?.QuizQuestions?.length}>
                      Submit Quiz
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : activeLesson ? (
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <h1 style={{ color: 'white', fontSize: 26, marginBottom: 24, fontFamily: 'Playfair Display' }}>{activeLesson.title}</h1>
              {activeLesson.videoUrl && (
                <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 24, background: '#000', aspectRatio: '16/9' }}>
                  {getYoutubeId(activeLesson.videoUrl) ? (
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYoutubeId(activeLesson.videoUrl)}`} frameBorder="0" allowFullScreen style={{ display: 'block' }}></iframe>
                  ) : (
                    <iframe src={activeLesson.videoUrl} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
                  )}
                </div>
              )}
              {activeLesson.content && (
                <div style={{ background: '#1e293b', borderRadius: 12, padding: 28, marginBottom: 24 }}>
                  <h3 style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>Lesson Content</h3>
                  <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{activeLesson.content}</p>
                </div>
              )}
              {activeLesson.pdfUrl && (
                <a href={activeLesson.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ color: '#94a3b8', borderColor: '#334155', marginBottom: 24 }}>
                  <i className="fas fa-file-pdf"></i> Download PDF
                </a>
              )}
              {!completedLessons.includes(activeLesson.id) && (
                <button onClick={() => markComplete(activeLesson.id)} className="btn btn-success btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fas fa-check"></i> Mark as Complete
                </button>
              )}
              {completedLessons.includes(activeLesson.id) && (
                <div style={{ textAlign: 'center', padding: 16, background: 'rgba(22,163,74,0.1)', borderRadius: 12, color: '#4ade80' }}>
                  <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i> Lesson Completed
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
              <i className="fas fa-play-circle" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3, display: 'block' }}></i>
              <p>Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
