import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import API from '../../api/axios';

const COLORS = ['#2563eb','#f59e0b','#16a34a','#7c3aed','#ef4444','#0891b2'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="loading"><div className="spinner"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Platform performance overview</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:20, marginBottom:32 }}>
        {[
          ['Total Students', data?.stats?.totalStudents, '#2563eb', '#dbeafe', 'fa-users'],
          ['Total Courses', data?.stats?.totalCourses, '#d97706', '#fef3c7', 'fa-graduation-cap'],
          ['Enrollments', data?.stats?.totalEnrollments, '#16a34a', '#dcfce7', 'fa-clipboard-list'],
          ['Certificates', data?.stats?.totalCertificates, '#7c3aed', '#ede9fe', 'fa-certificate'],
        ].map(([label, value, color, bg, icon]) => (
          <div key={label} className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:18 }}><i className={`fas ${icon}`}></i></div>
            <div><div style={{ fontSize:26, fontWeight:700, fontFamily:'Playfair Display' }}>{value || 0}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>{label}</div></div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div className="card">
          <h2 style={{ fontSize:18, color:'var(--primary)', marginBottom:20 }}>Course Enrollments</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={(data?.popularCourses || []).map(c => ({ name: c.title.substring(0,12)+'...', count: c.popularityCount }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4,4,0,0]} name="Enrollments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 style={{ fontSize:18, color:'var(--primary)', marginBottom:20 }}>Popularity Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={(data?.popularCourses || []).map(c => ({ name: c.title.substring(0,15), value: c.popularityCount || 1 }))} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                {(data?.popularCourses || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
