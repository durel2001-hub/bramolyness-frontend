import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/enrollments').then(r => { setEnrollments(r.data.enrollments || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="page-title">Enrollments</h1>
      <p className="page-subtitle">{enrollments.length} total enrollments</p>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Status</th><th>Enrolled</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }}></div></td></tr>
              : enrollments.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ fontWeight:600, fontSize:14 }}>{e.User?.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{e.User?.email}</div>
                  </td>
                  <td style={{ fontWeight:500 }}>{e.Course?.title}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="progress-bar" style={{ width:80 }}><div className="progress-fill" style={{ width:`${e.progress||0}%` }}></div></div>
                      <span style={{ fontSize:12, color:'var(--text-muted)' }}>{Math.round(e.progress||0)}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${e.status==='completed'?'badge-success':e.status==='pending'?'badge-warning':'badge-primary'}`}>{e.status}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
