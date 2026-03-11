import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function AdminQuizzes() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [quizForm, setQuizForm] = useState({ title:'', passingScore:70 });
  const [qForm, setQForm] = useState({ question:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswer:'A' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/admin/courses').then(r => setCourses(r.data.courses || [])).catch(() => {});
  }, []);

  const loadQuiz = (courseId) => {
    setSelected(courseId); setQuiz(null);
    API.get(`/quiz/${courseId}`).then(r => setQuiz(r.data.quiz)).catch(() => setQuiz(null));
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    await API.post('/admin/quizzes', { ...quizForm, courseId: selected });
    loadQuiz(selected); setShowQuizForm(false);
    setMsg('Quiz created!'); setTimeout(() => setMsg(''), 3000);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    await API.post('/admin/quizzes/questions', { ...qForm, quizId: quiz.id });
    loadQuiz(selected); setShowQForm(false);
    setQForm({ question:'', optionA:'', optionB:'', optionC:'', optionD:'', correctAnswer:'A' });
    setMsg('Question added!'); setTimeout(() => setMsg(''), 3000);
  };

  const deleteQuestion = async (id) => {
    await API.delete(`/admin/quizzes/questions/${id}`);
    loadQuiz(selected);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Quiz Management</h1>
      <p className="page-subtitle">Create and manage course quizzes</p>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:24, alignItems:'start' }}>
        <div className="card" style={{ position:'sticky', top:24 }}>
          <h3 style={{ fontSize:16, color:'var(--primary)', marginBottom:14 }}>Select Course</h3>
          {courses.map(c => (
            <button key={c.id} onClick={() => loadQuiz(c.id)} style={{
              display:'block', width:'100%', textAlign:'left', padding:'10px 12px', borderRadius:8, marginBottom:4,
              background: selected===c.id ? 'var(--primary-light)' : 'transparent', color: selected===c.id ? 'white' : 'var(--text)',
              border:'none', fontSize:14, cursor:'pointer', transition:'all 0.2s'
            }}>{c.title}</button>
          ))}
        </div>

        <div>
          {!selected && <div className="card" style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><i className="fas fa-question-circle" style={{ fontSize:32, marginBottom:16, display:'block', opacity:0.3 }}></i>Select a course to manage its quiz</div>}
          {selected && !quiz && (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <p style={{ color:'var(--text-muted)', marginBottom:20 }}>No quiz for this course yet.</p>
              <button onClick={() => setShowQuizForm(true)} className="btn btn-primary"><i className="fas fa-plus"></i> Create Quiz</button>
            </div>
          )}
          {quiz && (
            <>
              <div className="card" style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <h2 style={{ fontSize:20, color:'var(--primary)' }}>{quiz.title}</h2>
                    <p style={{ color:'var(--text-muted)', fontSize:14 }}>Passing score: {quiz.passingScore}% | {quiz.QuizQuestions?.length || 0} questions</p>
                  </div>
                  <button onClick={() => setShowQForm(true)} className="btn btn-primary btn-sm"><i className="fas fa-plus"></i> Add Question</button>
                </div>
              </div>
              {quiz.QuizQuestions?.map((q, qi) => (
                <div key={q.id} className="card" style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <p style={{ fontWeight:600, fontSize:14, color:'var(--text)', flex:1 }}>{qi+1}. {q.question}</p>
                    <button onClick={() => deleteQuestion(q.id)} className="btn btn-danger btn-sm" style={{ marginLeft:12 }}>Delete</button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {['A','B','C','D'].map(opt => (
                      <div key={opt} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8, background: q.correctAnswer===opt ? '#dcfce7' : '#f8fafc', border:`1px solid ${q.correctAnswer===opt ? '#16a34a' : 'var(--border)'}` }}>
                        <span style={{ fontWeight:700, fontSize:12, color: q.correctAnswer===opt ? '#16a34a' : 'var(--text-muted)', width:16 }}>{opt}.</span>
                        <span style={{ fontSize:13, color: q.correctAnswer===opt ? '#15803d' : 'var(--text)' }}>{q[`option${opt}`]}</span>
                        {q.correctAnswer===opt && <i className="fas fa-check" style={{ color:'#16a34a', fontSize:11, marginLeft:'auto' }}></i>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!quiz.QuizQuestions || quiz.QuizQuestions.length === 0) && <div className="card" style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No questions yet. Add questions above.</div>}
            </>
          )}
        </div>
      </div>

      {showQuizForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:440, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>Create Quiz</h2>
              <button onClick={() => setShowQuizForm(false)} style={{ background:'none', fontSize:22 }}>×</button>
            </div>
            <form onSubmit={createQuiz}>
              <div className="form-group"><label>Quiz Title *</label><input value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} required placeholder="e.g. Final Assessment" /></div>
              <div className="form-group"><label>Passing Score (%)</label><input type="number" min={0} max={100} value={quizForm.passingScore} onChange={e => setQuizForm({...quizForm, passingScore: e.target.value})} /></div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>Create Quiz</button>
                <button type="button" onClick={() => setShowQuizForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:24 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>Add Question</h2>
              <button onClick={() => setShowQForm(false)} style={{ background:'none', fontSize:22 }}>×</button>
            </div>
            <form onSubmit={addQuestion}>
              <div className="form-group"><label>Question *</label><textarea value={qForm.question} onChange={e => setQForm({...qForm, question: e.target.value})} required rows={3} style={{ resize:'vertical' }} placeholder="Type your question..." /></div>
              {['A','B','C','D'].map(opt => (
                <div className="form-group" key={opt}><label>Option {opt}</label><input value={qForm[`option${opt}`]} onChange={e => setQForm({...qForm, [`option${opt}`]: e.target.value})} required placeholder={`Answer option ${opt}`} /></div>
              ))}
              <div className="form-group"><label>Correct Answer</label>
                <select value={qForm.correctAnswer} onChange={e => setQForm({...qForm, correctAnswer: e.target.value})}>
                  {['A','B','C','D'].map(o => <option key={o} value={o}>Option {o}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>Add Question</button>
                <button type="button" onClick={() => setShowQForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
