import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/courses/student/enrollments').then(r => { setEnrollments(r.data.enrollments || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="page-title">My Courses</h1>
      <p className="page-subtitle">All your enrolled courses</p>
      {loading ? <div className="loading"><div className="spinner"></div></div> : (
        enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <i className="fas fa-book-open" style={{ fontSize: 48, color: 'var(--border)', marginBottom: 16 }}></i>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'DM Sans' }}>No courses yet</h3>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {enrollments.map(e => (
              <div key={e.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span className={`badge ${e.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>{e.status === 'completed' ? '✓ Completed' : 'In Progress'}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.Course?.Category?.name}</span>
                </div>
                <h3 style={{ fontSize: 17, color: 'var(--primary)', marginBottom: 12, fontFamily: 'Playfair Display' }}>{e.Course?.title}</h3>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-light)' }}>{Math.round(e.progress || 0)}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${e.progress || 0}%` }}></div></div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                  <Link to={`/learn/${e.courseId}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    <i className={`fas ${e.status === 'completed' ? 'fa-redo' : 'fa-play'}`}></i>
                    {e.status === 'completed' ? 'Review' : 'Continue'}
                  </Link>
                  {e.status === 'completed' && <Link to="/certificates" className="btn btn-success btn-sm"><i className="fas fa-certificate"></i></Link>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
