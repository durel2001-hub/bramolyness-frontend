import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import API from '../../api/axios';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'' });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get('/events').then(r => { setEvents(r.data.events || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault(); setSubmitting(true); setMsg('');
    try {
      await API.post('/events/register', { ...form, eventId: selected.id });
      setMsg('Registration successful! Check your email for confirmation.');
      setForm({ name:'', email:'', phone:'' });
      setTimeout(() => { setSelected(null); setMsg(''); }, 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div style={{ background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: 'white', fontSize: 40, marginBottom: 8 }}>Events & Workshops</h1>
            <p style={{ color: '#94a3b8' }}>Short-term training sessions — no account required</p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
              {events.map(e => (
                <div key={e.id} className="card" style={{ borderTop: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="badge badge-warning"><i className="fas fa-calendar" style={{ marginRight: 4 }}></i>{new Date(e.date).toLocaleDateString('en-KE', { month:'short', day:'numeric', year:'numeric' })}</span>
                  </div>
                  <h3 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display' }}>{e.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{e.description}</p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                    <span><i className="fas fa-map-marker-alt" style={{ marginRight: 4, color: 'var(--accent)' }}></i>{e.location}</span>
                    <span><i className="fas fa-tag" style={{ marginRight: 4, color: 'var(--accent)' }}></i>KES {e.price}</span>
                  </div>
                  <button onClick={() => setSelected(e)} className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>Register for Event</button>
                </div>
              ))}
              {events.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', gridColumn: '1/-1' }}><i className="fas fa-calendar-times" style={{ fontSize: 40, opacity: 0.3, display: 'block', marginBottom: 12 }}></i>No upcoming events</div>}
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--primary)' }}>Register for Event</h2>
              <button onClick={() => { setSelected(null); setMsg(''); }} style={{ background: 'none', fontSize: 20, color: 'var(--text-muted)' }}>×</button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}><strong>{selected.title}</strong></p>
            {msg && <div className={`alert ${msg.includes('successful') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Full Name</label><input placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Phone</label><input placeholder="+254700000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>{submitting ? 'Registering...' : 'Confirm Registration'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
