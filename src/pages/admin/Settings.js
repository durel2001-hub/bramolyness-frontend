import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([API.get('/admin/settings'), API.get('/admin/categories')]).then(([s, c]) => {
      setSettings(s.data.settings || {});
      setCategories(c.data.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    await API.put('/admin/settings', settings).catch(() => {});
    setMsg('Settings saved!'); setTimeout(() => setMsg(''), 3000);
  };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await API.post('/admin/categories', { name: newCat }).catch(() => {});
    API.get('/admin/categories').then(r => setCategories(r.data.categories || []));
    setNewCat('');
  };

  const deleteCategory = async (id) => {
    await API.delete(`/admin/categories/${id}`).catch(() => {});
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <DashboardLayout><div className="loading"><div className="spinner"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure your LMS platform</p>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div className="card">
          <h2 style={{ fontSize:18, color:'var(--primary)', marginBottom:20 }}>General Settings</h2>
          <form onSubmit={saveSettings}>
            <div className="form-group"><label>Site Name</label><input value={settings.site_name || ''} onChange={e => setSettings({...settings, site_name: e.target.value})} placeholder="Bramo Lyness LMS" /></div>
            <div className="form-group"><label>Certificate Signature</label><input value={settings.cert_signature || ''} onChange={e => setSettings({...settings, cert_signature: e.target.value})} placeholder="Director, Bramo Lyness" /></div>
            <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Save Settings</button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ fontSize:18, color:'var(--primary)', marginBottom:20 }}>Email (SMTP) Settings</h2>
          <form onSubmit={saveSettings}>
            <div className="form-group"><label>SMTP Host</label><input value={settings.smtp_host || ''} onChange={e => setSettings({...settings, smtp_host: e.target.value})} placeholder="smtp.gmail.com" /></div>
            <div className="form-group"><label>SMTP Port</label><input value={settings.smtp_port || ''} onChange={e => setSettings({...settings, smtp_port: e.target.value})} placeholder="587" /></div>
            <div className="form-group"><label>SMTP Email</label><input type="email" value={settings.smtp_user || ''} onChange={e => setSettings({...settings, smtp_user: e.target.value})} placeholder="your@gmail.com" /></div>
            <div className="form-group"><label>SMTP Password</label><input type="password" value={settings.smtp_pass || ''} onChange={e => setSettings({...settings, smtp_pass: e.target.value})} placeholder="App password" /></div>
            <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Save SMTP</button>
          </form>
        </div>

        <div className="card" style={{ gridColumn:'1/-1' }}>
          <h2 style={{ fontSize:18, color:'var(--primary)', marginBottom:20 }}>Course Categories</h2>
          <div style={{ display:'flex', gap:12, marginBottom:20 }}>
            <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" onKeyDown={e => e.key==='Enter' && addCategory()} />
            <button onClick={addCategory} className="btn btn-primary" style={{ whiteSpace:'nowrap' }}><i className="fas fa-plus"></i> Add</button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {categories.map(c => (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:8, background:'#f8fafc', border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px' }}>
                <span style={{ fontSize:14, fontWeight:500 }}>{c.name}</span>
                <button onClick={() => deleteCategory(c.id)} style={{ background:'none', color:'var(--danger)', fontSize:16, lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
