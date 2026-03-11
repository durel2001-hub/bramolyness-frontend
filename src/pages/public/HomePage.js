import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import API from '../../api/axios';

const stats = [
  { icon: 'fa-users', value: '5,000+', label: 'Students Trained' },
  { icon: 'fa-book', value: '12+', label: 'Expert Courses' },
  { icon: 'fa-certificate', value: '98%', label: 'Success Rate' },
  { icon: 'fa-briefcase', value: '200+', label: 'Companies Served' },
];

const testimonials = [
  { name: 'Jane Wangari', role: 'Software Developer', text: 'Bramo Lyness transformed my career. The Software Development course was world-class.', avatar: 'JW' },
  { name: 'Peter Kamau', role: 'IT Manager', text: 'The Cyber Security course gave me practical skills I use every day at work.', avatar: 'PK' },
  { name: 'Mary Achieng', role: 'Business Owner', text: 'Customer Care and Public Relations courses helped me grow my business significantly.', avatar: 'MA' },
];

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get('/courses?sort=popular').then(r => setCourses(r.data.courses?.slice(0,3) || [])).catch(() => {});
    API.get('/events').then(r => setEvents(r.data.events?.slice(0,3) || [])).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0f2444 0%,#1a3c6e 60%,#0f2444 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 68, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.1) 0%, transparent 40%)' }}></div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <span style={{ display: 'inline-block', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(245,158,11,0.3)' }}>🎓 Kenya's Premier Training Institute</span>
            <h1 style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
              Transform Your Career with <span style={{ color: '#f59e0b' }}>Expert Training</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 540 }}>
              Gain practical skills in Technology, Business, and Life Skills. Learn from experts and earn certificates recognized across Kenya.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/courses" className="btn btn-accent btn-lg"><i className="fas fa-rocket"></i> Explore Courses</Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}><i className="fas fa-user-plus"></i> Register Free</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'white', padding: '60px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
          {stats.map((s,i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--primary-light)', fontSize: 22 }}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div style={{ fontFamily: 'Playfair Display', fontSize: 32, fontWeight: 700, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, color: 'var(--primary)', marginBottom: 12 }}>Featured Courses</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Explore our most popular training programs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {courses.map(c => (
              <div key={c.id} className="card" style={{ transition: 'transform 0.2s,box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ height: 8, background: 'linear-gradient(90deg,var(--primary-light),var(--accent))', borderRadius: '8px 8px 0 0', margin: '-24px -24px 20px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#dbeafe,#eff6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontSize: 20 }}><i className="fas fa-graduation-cap"></i></div>
                  <span className="badge badge-primary">{c.Category?.name || 'Course'}</span>
                </div>
                <h3 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{c.description?.substring(0,100)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}><i className="fas fa-clock" style={{ marginRight: 4 }}></i>{c.duration}</span>
                  <Link to={`/courses/${c.id}`} className="btn btn-primary btn-sm">Enroll Now</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/courses" className="btn btn-outline btn-lg">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section style={{ padding: '80px 24px', background: 'white' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 38, color: 'var(--primary)', marginBottom: 12 }}>Upcoming Events</h2>
              <p style={{ color: 'var(--text-muted)' }}>Short-term workshops and training sessions</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
              {events.map(e => (
                <div key={e.id} className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <i className="fas fa-calendar-alt" style={{ color: 'var(--accent)', fontSize: 18 }}></i>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(e.date).toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
                  </div>
                  <h3 style={{ fontSize: 18, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Playfair Display' }}>{e.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{e.description?.substring(0,100)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}><i className="fas fa-map-marker-alt" style={{ marginRight: 4 }}></i>{e.location}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>KES {e.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/events" className="btn btn-outline btn-lg">View All Events</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg,#0f2444,#1a3c6e)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, color: 'white', marginBottom: 12 }}>What Our Students Say</h2>
            <p style={{ color: '#94a3b8' }}>Real stories from real graduates</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {testimonials.map((t,i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28 }}>
                <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 16 }}>★★★★★</div>
                <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 38, color: 'var(--primary)', marginBottom: 16 }}>Ready to Start Learning?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>Join thousands of students who have transformed their careers with Bramo Lyness.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg"><i className="fas fa-user-plus"></i> Get Started Free</Link>
            <Link to="/courses" className="btn btn-outline btn-lg">Browse Courses</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f2444', color: '#94a3b8', padding: '40px 24px', textAlign: 'center' }}>
      <img src="/logo.png" alt="Bramolyness" style={{ height: 40, marginBottom: 8 }} />
       <div style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: 20, marginBottom: 8 }}>Bramolyness Training Institute</div>
        <p style={{ fontSize: 13, marginBottom: 16 }}>Nairobi, Kenya | info@bramolyness.co.ke</p>
        <p style={{ fontSize: 12, color: '#475569' }}>© {new Date().getFullYear()} BramoLyness. All rights reserved.</p>
      </footer>
    </div>
  );
}
