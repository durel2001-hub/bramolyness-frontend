import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import API from '../../api/axios';

const EMPTY = { title:'', description:'', categoryId:'', duration:'', instructor:'', isPublished: false };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchAll = () => {
    setLoading(true);
    Promise.all([API.get('/admin/courses'), API.get('/admin/categories')]).then(([c, cat]) => {
      setCourses(c.data.courses || []);
      setCategories(cat.data.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await API.put(`/admin/courses/${editId}`, form);
      else await API.post('/admin/courses', form);
      setShowForm(false); fetchAll();
      setMsg(editId ? 'Course updated!' : 'Course created!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await API.delete(`/admin/courses/${id}`).catch(() => {});
    fetchAll(); setMsg('Course deleted'); setTimeout(() => setMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 className="page-title">Manage Courses</h1><p className="page-subtitle">{courses.length} courses total</p></div>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }} className="btn btn-primary"><i className="fas fa-plus"></i> Add Course</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Duration</th><th>Instructor</th><th>Published</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign:'center', padding:40 }}><div className="spinner" style={{ margin:'0 auto' }}></div></td></tr>
              : courses.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:600, maxWidth:200 }}>{c.title}</td>
                  <td>{c.Category?.name || '-'}</td>
                  <td>{c.duration}</td>
                  <td>{c.instructor}</td>
                  <td><span className={`badge ${c.isPublished ? 'badge-success' : 'badge-warning'}`}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => { setForm({...c, categoryId: c.categoryId || ''}); setEditId(c.id); setShowForm(true); }} className="btn btn-outline btn-sm">Edit</button>
                      <button onClick={() => deleteCourse(c.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && courses.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No courses yet</div>}
        </div>
      </div>

      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:24 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:20, color:'var(--primary)' }}>{editId ? 'Edit' : 'New'} Course</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', fontSize:22, color:'var(--text-muted)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Course Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Cyber Security" /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ resize:'vertical' }} placeholder="Course description..." /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="form-group"><label>Category</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 8 Weeks" /></div>
              </div>
              <div className="form-group"><label>Instructor Name</label><input value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} placeholder="Instructor name" /></div>
              <div className="form-group">
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <input type="checkbox" checked={!!form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} style={{ width:'auto' }} />
                  Publish Course (visible to students)
                </label>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>{editId ? 'Update Course' : 'Create Course'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
