import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

const EMPTY = { title:'', description:'', date:'', location:'', price:0 };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchEvents = () => {
    setLoading(true);
    API.get('/admin/events').then(r => { setEvents(r.data.events || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/admin/events/${editId}`, form);
      else await API.post('/admin/events', form);
      setShowForm(false); fetchEvents();
      setMsg(editId ? 'Event updated!' : 'Event created!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <DashboardLayout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div><h1 className="page-title">Manage Events</h1><p className="page-subtitle">Workshops and short-term sessions</p></div>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="btn btn-primary"><i className="fas fa-plus"></i> Add Event</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Price (KES)</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }}></div></td></tr>
              : events.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight:600 }}>{e.title}</td>
                  <td>{e.date ? new Date(e.date).toLocaleDateString() : '-'}</td>
                  <td>{e.location}</td>
                  <td>{e.price}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => { setForm({...e, date: e.date?.substring(0,16) || ''}); setEditId(e.id); setShowForm(true); }} className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={async () => { if (!window.confirm('Delete?')) return; await API.delete(`/admin/events/${e.id}`); fetchEvents(); }} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:24 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:'100%', maxWidth:480, boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>{editId ? 'Edit' : 'New'} Event</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', fontSize:22 }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Event Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ resize:'vertical' }} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                <div className="form-group"><label>Price (KES)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Nairobi CBD" /></div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>{editId ? 'Update' : 'Create'} Event</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
