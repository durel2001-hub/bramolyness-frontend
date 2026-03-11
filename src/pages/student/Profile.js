import React, { useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault(); setMsg(''); setError('');
    try {
      await API.put('/auth/profile', form);
      setMsg('Profile updated successfully');
    } catch { setError('Update failed'); }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Manage your account information</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h2 style={{ fontSize: 20, color: 'var(--primary)', marginBottom: 20 }}>Personal Information</h2>
          {msg && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleProfile}>
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Email Address</label><input value={user?.email} disabled style={{ background: '#f8fafc', color: 'var(--text-muted)' }} /></div>
            <div className="form-group"><label>Phone Number</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
        <div className="card">
          <h2 style={{ fontSize: 20, color: 'var(--primary)', marginBottom: 20 }}>Account Details</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700 }}>{user?.name?.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email}</div>
              <span className="badge badge-primary" style={{ marginTop: 6 }}>{user?.role}</span>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>To change your password, use the Forgot Password feature from the login page.</p>
            <button onClick={() => { logout(); window.location.href = '/'; }} className="btn btn-danger btn-sm"><i className="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
