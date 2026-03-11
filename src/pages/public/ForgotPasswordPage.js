import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setMsg('');
    try {
      await API.post('/auth/forgot-password', { email });
      setMsg('Password reset link sent! Check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
         <img src="/logo.png" alt="Bramolyness" style={{ height: 52, margin: '0 auto 14px', display: 'block' }} />
          <h1 style={{ fontSize: 24, color: 'var(--primary)', marginBottom: 4 }}>Forgot Password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Enter your email to receive a reset link</p>
        </div>
        {msg && <div className="alert alert-success"><i className="fas fa-check-circle"></i>{msg}</div>}
        {error && <div className="alert alert-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          <Link to="/login" style={{ color: 'var(--primary-light)' }}><i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
