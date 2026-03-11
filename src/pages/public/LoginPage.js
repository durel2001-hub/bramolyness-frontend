import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') {
        setError('Access denied. Please use the admin portal.');
        logout();
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="Bramolyness" style={{ height: 52, marginBottom: 16 }} />
          <h1 style={{ fontSize: 26, color: 'var(--primary)', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to your Bramolyness account</p>
        </div>
        {error && <div className="alert alert-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
<div style={{ position: 'relative' }}>
  <input 
    type={showPassword ? 'text' : 'password'} 
    placeholder="Min. 8 characters" 
    value={form.password} 
    onChange={e => setForm({...form, password: e.target.value})} 
    required 
    minLength={8}
    style={{ paddingRight: 44 }}
  />
  <button 
    type="button" 
    onClick={() => setShowPassword(!showPassword)} 
    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', fontSize: 15 }}
  >
    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
  </button>
</div>           
          </div>
          <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -10 }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary-light)', fontSize: 13 }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Register</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}><i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}