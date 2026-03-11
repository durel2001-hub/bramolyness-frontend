import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get(`/courses/${id}`).then(r => { setCourse(r.data.course); setLoading(false); }).catch(() => setLoading(false));
    if (user) {
      API.get('/courses/student/enrollments').then(r => {
        const isEnrolled = r.data.enrollments?.some(e => e.courseId === parseInt(id));
        setEnrolled(isEnrolled);
      }).catch(() => {});
    }
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate('/register');
    setEnrolling(true);
    try {
      await API.post(`/courses/enroll/${id}`);
      setEnrolled(true);
      setMsg('Successfully enrolled! Redirecting...');
      setTimeout(() => navigate('/my-courses'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!course) return <div style={{ padding: 40, textAlign: 'center' }}>Course not found</div>;

  const totalLessons = course.Modules?.reduce((acc, m) => acc + (m.Lessons?.length || 0), 0) || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div style={{ background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Link to="/courses" style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}><i className="fas fa-arrow-left"></i> Back to Courses</Link>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 16 }}>{course.Category?.name}</span>
                <h1 style={{ color: 'white', fontSize: 'clamp(24px,4vw,42px)', marginBottom: 12 }}>{course.title}</h1>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 600 }}>{course.description}</p>
                <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
                  {[['fa-clock', course.duration], ['fa-user-tie', course.instructor], ['fa-book', `${course.Modules?.length || 0} Modules`], ['fa-file-alt', `${totalLessons} Lessons`]].map(([icon, val], i) => (
                    <span key={i} style={{ color: '#cbd5e1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><i className={`fas ${icon}`} style={{ color: '#f59e0b' }}></i>{val}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 28, minWidth: 260, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>FREE</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Full course access</p>
                {msg && <div className={`alert ${enrolled ? 'alert-success' : 'alert-error'}`} style={{ fontSize: 13 }}>{msg}</div>}
                {enrolled ? (
                  <button onClick={() => navigate('/my-courses')} className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }}><i className="fas fa-play"></i> Continue Learning</button>
                ) : (
                  <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={enrolling}>
                    {enrolling ? 'Enrolling...' : user ? 'Enroll Now' : 'Register to Enroll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
          <h2 style={{ fontSize: 26, color: 'var(--primary)', marginBottom: 24 }}>Course Curriculum</h2>
          {course.Modules?.map((module, mi) => (
            <div key={module.id} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: module.Lessons?.length ? 16 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{mi + 1}</div>
                <h3 style={{ fontSize: 16, color: 'var(--primary)', fontFamily: 'DM Sans', fontWeight: 600 }}>{module.title}</h3>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13 }}>{module.Lessons?.length || 0} lessons</span>
              </div>
              {module.Lessons?.map((lesson, li) => (
                <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <i className={`fas ${lesson.videoUrl ? 'fa-play-circle' : lesson.pdfUrl ? 'fa-file-pdf' : 'fa-file-alt'}`} style={{ color: 'var(--text-muted)', width: 20, textAlign: 'center' }}></i>
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>{lesson.title}</span>
                  <i className="fas fa-lock" style={{ marginLeft: 'auto', color: 'var(--border)', fontSize: 12 }}></i>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
