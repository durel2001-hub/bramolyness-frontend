import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchCerts = () => {
    setLoading(true);
    API.get('/admin/certificates').then(r => { setCerts(r.data.certificates || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, []);

  const revoke = async (id) => {
    if (!window.confirm('Revoke this certificate?')) return;
    await API.delete(`/admin/certificates/${id}`).catch(() => {});
    fetchCerts(); setMsg('Certificate revoked'); setTimeout(() => setMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Certificates</h1>
      <p className="page-subtitle">{certs.length} certificates issued</p>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Course</th><th>Certificate ID</th><th>Issued Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }}></div></td></tr>
              : certs.map(c => (
                <tr key={c.id}>
                  <td><div style={{ fontWeight:600 }}>{c.User?.name}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.User?.email}</div></td>
                  <td>{c.Course?.title}</td>
                  <td><span style={{ fontFamily:'monospace', fontSize:12, background:'#f8fafc', padding:'2px 8px', borderRadius:4 }}>{c.certificateId}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(c.issuedDate).toLocaleDateString()}</td>
                  <td><button onClick={() => revoke(c.id)} className="btn btn-danger btn-sm">Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
