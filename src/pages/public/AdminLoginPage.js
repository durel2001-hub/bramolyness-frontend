import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        setError('Access denied. Admins only.');
        logout();
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f2444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="Bramolyness" style={{ height: 52, marginBottom: 16 }} />
          <h1 style={{ fontSize: 22, color: 'var(--primary)', marginBottom: 4 }}>Admin Access</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Restricted area — authorized personnel only</p>
        </div>
        {error && <div className="alert alert-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@bramolyness.co.ke" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
  <input 
    type={showPassword ? 'text' : 'password'} 
    placeholder="••••••••" 
    value={form.password} 
    onChange={e => setForm({...form, password: e.target.value})} 
    required
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <a href="/" style={{ color: 'var(--text-muted)' }}>← Back to Website</a>
        </p>
      </div>
    </div>
  );
}