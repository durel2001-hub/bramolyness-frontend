import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../../api/axios';

const COLORS = ['#2563eb','#f59e0b','#16a34a','#7c3aed','#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents:0, totalCourses:0, totalEnrollments:0, totalCertificates:0 });
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics').then(r => {
      setStats(r.data.stats);
      setPopular(r.data.popularCourses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: 'fa-users', color: '#2563eb', bg: '#dbeafe', link: '/admin/users' },
    { label: 'Total Courses', value: stats.totalCourses, icon: 'fa-graduation-cap', color: '#d97706', bg: '#fef3c7', link: '/admin/courses' },
    { label: 'Enrollments', value: stats.totalEnrollments, icon: 'fa-clipboard-list', color: '#16a34a', bg: '#dcfce7', link: '/admin/enrollments' },
    { label: 'Certificates', value: stats.totalCertificates, icon: 'fa-certificate', color: '#7c3aed', bg: '#ede9fe', link: '/admin/certificates' },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Overview of Bramo Lyness LMS</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
        {statCards.map((s,i) => (
          <Link key={i} to={s.link} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform=''}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 20 }}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Playfair Display', color: 'var(--text)' }}>{loading ? '...' : s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 20 }}>Course Popularity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={popular.map(c => ({ name: c.title.substring(0,15) + '...', enrollments: c.popularityCount }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#2563eb" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 20 }}>Top Courses</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={popular} dataKey="popularityCount" nameKey="title" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name?.substring(0,10)}... ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {popular.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val, name) => [val, name?.substring(0,20)]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            ['/admin/courses', 'fa-plus', 'Add Course', 'btn-primary'],
            ['/admin/users', 'fa-users', 'Manage Users', 'btn-outline'],
            ['/admin/events', 'fa-calendar-plus', 'Add Event', 'btn-outline'],
            ['/admin/quizzes', 'fa-question-circle', 'Manage Quizzes', 'btn-outline'],
            ['/admin/settings', 'fa-cog', 'Settings', 'btn-outline'],
          ].map(([path, icon, label, cls]) => (
            <Link key={path} to={path} className={`btn ${cls}`}><i className={`fas ${icon}`}></i>{label}</Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
