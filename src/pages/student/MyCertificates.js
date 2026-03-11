import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/certificates').then(r => { setCerts(r.data.certificates || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDownload = (courseId, certId) => {
    const token = localStorage.getItem('token');
    const a = document.createElement('a');
    a.href = `http://localhost:5000/api/certificates/${courseId}`;
    a.download = `certificate-${certId}.pdf`;
    fetch(a.href, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob()).then(blob => {
        const url = URL.createObjectURL(blob);
        a.href = url; a.click(); URL.revokeObjectURL(url);
      });
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">My Certificates</h1>
      <p className="page-subtitle">Your earned completion certificates</p>
      {loading ? <div className="loading"><div className="spinner"></div></div> : (
        certs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <i className="fas fa-certificate" style={{ fontSize: 48, color: 'var(--border)', marginBottom: 16 }}></i>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'DM Sans' }}>No certificates yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Complete a course and pass the quiz to earn your certificate</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
            {certs.map(c => (
              <div key={c.id} className="card" style={{ background: 'linear-gradient(135deg,#f0f7ff,#e8f4ff)', border: '2px solid #bfdbfe', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
                <h3 style={{ fontSize: 20, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display' }}>{c.Course?.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 4 }}>Instructor: {c.Course?.instructor}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Issued: {new Date(c.issuedDate).toLocaleDateString()}</p>
                <p style={{ color: '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>ID: {c.certificateId}</p>
                <button onClick={() => handleDownload(c.courseId, c.certificateId)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fas fa-download"></i> Download PDF
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
