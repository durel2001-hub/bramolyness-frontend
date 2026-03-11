import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/courses/student/enrollments'),
      API.get('/notifications'),
      API.get('/certificates')
    ]).then(([e, n, c]) => {
      setEnrollments(e.data.enrollments || []);
      setNotifications(n.data.notifications?.slice(0,5) || []);
      setCertificates(c.data.certificates || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: 'fa-book-open', label: 'Enrolled Courses', value: enrollments.length, color: '#2563eb', bg: '#dbeafe' },
    { icon: 'fa-chart-line', label: 'In Progress', value: enrollments.filter(e => e.status === 'active').length, color: '#d97706', bg: '#fef3c7' },
    { icon: 'fa-check-circle', label: 'Completed', value: enrollments.filter(e => e.status === 'completed').length, color: '#16a34a', bg: '#dcfce7' },
    { icon: 'fa-certificate', label: 'Certificates', value: certificates.length, color: '#7c3aed', bg: '#ede9fe' },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Here's an overview of your learning journey</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((s,i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 20 }}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', fontFamily: 'Playfair Display' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Enrolled Courses */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, color: 'var(--primary)' }}>My Courses</h2>
            <Link to="/my-courses" style={{ color: 'var(--primary-light)', fontSize: 13, fontWeight: 500 }}>View All</Link>
          </div>
          {loading ? <div className="loading"><div className="spinner"></div></div> : enrollments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              <i className="fas fa-book" style={{ fontSize: 32, opacity: 0.3, marginBottom: 12, display: 'block' }}></i>
              <p style={{ marginBottom: 16 }}>No courses yet</p>
              <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
            </div>
          ) : enrollments.slice(0,4).map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}><i className="fas fa-graduation-cap"></i></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.Course?.title}</div>
                <div className="progress-bar" style={{ marginBottom: 4 }}>
                  <div className="progress-fill" style={{ width: `${e.progress || 0}%` }}></div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(e.progress || 0)}% complete</div>
              </div>
              <Link to={`/learn/${e.courseId}`} className="btn btn-primary btn-sm">Continue</Link>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 style={{ fontSize: 20, color: 'var(--primary)', marginBottom: 20 }}>Notifications</h2>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 14 }}>No notifications</div>
          ) : notifications.map(n => (
            <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.isRead ? 'var(--border)' : 'var(--primary-light)', marginTop: 6, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
