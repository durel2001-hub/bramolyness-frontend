import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import API from '../../api/axios';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      const r = await API.get(`/courses?${params}`);
      setCourses(r.data.courses || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    API.get('/admin/categories').then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchCourses(); }, [search, category, sort]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div style={{ background: 'linear-gradient(135deg,#0f2444,#1a3c6e)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: 'white', fontSize: 40, marginBottom: 8 }}>Our Courses</h1>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>Explore all our training programs</p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}></i>
              <input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ minWidth: 160 }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ minWidth: 160 }}>
              <option value="">Latest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                {courses.map(c => (
                  <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 6, background: 'linear-gradient(90deg,var(--primary-light),var(--accent))', borderRadius: '8px 8px 0 0', margin: '-24px -24px 20px' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span className="badge badge-primary">{c.Category?.name || 'General'}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}><i className="fas fa-users" style={{ marginRight: 4 }}></i>{c.popularityCount} enrolled</span>
                    </div>
                    <h3 style={{ fontSize: 17, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display' }}>{c.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{c.description?.substring(0,110)}...</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                      <span><i className="fas fa-clock" style={{ marginRight: 4 }}></i>{c.duration}</span>
                      <span><i className="fas fa-user-tie" style={{ marginRight: 4 }}></i>{c.instructor}</span>
                    </div>
                    <Link to={`/courses/${c.id}`} className="btn btn-primary" style={{ justifyContent: 'center' }}>View Course</Link>
                  </div>
                ))}
              </div>
              {courses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                  <i className="fas fa-search" style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}></i>
                  <p>No courses found. Try different filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
