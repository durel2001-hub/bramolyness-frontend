import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#2563eb,#f59e0b)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontFamily: 'Playfair Display', color: 'white', fontSize: 24, fontWeight: 700 }}>B</div>
          <h1 style={{ fontSize: 24, color: 'var(--primary)', marginBottom: 4 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Join Bramo Lyness LMS today</p>
        </div>
        {error && <div className="alert alert-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input placeholder="+254700000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
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
          <div className="form-group">
            <label>Confirm Password</label>
          <div style={{ position: 'relative' }}>
  <input 
    type={showConfirm ? 'text' : 'password'} 
    placeholder="Repeat password" 
    value={form.confirmPassword} 
    onChange={e => setForm({...form, confirmPassword: e.target.value})} 
    required 
    minLength={8}
    style={{ paddingRight: 44 }}
  />
  <button 
    type="button" 
    onClick={() => setShowConfirm(!showConfirm)} 
    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', fontSize: 15 }}
  >
    <i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
  </button>
</div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 4 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
