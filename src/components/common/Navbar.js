import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      API.get('/notifications').then(r => setUnread(r.data.unreadCount || 0)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(15,36,68,0.98)' : 'rgba(15,36,68,0.95)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.2)' : 'none',
      transition: 'all 0.3s'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Bramolyness" style={{ height: 38 }} />
         <span style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: 20, fontWeight: 700 }}>Bramolyness</span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[['/', 'Home'], ['/courses', 'Courses'], ['/events', 'Events']].map(([path, label]) => (
            <Link key={path} to={path} style={{ color: isActive(path) ? '#f59e0b' : '#cbd5e1', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>{label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ position: 'relative' }}>
                {unread > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread}</span>}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#cbd5e1', borderColor: '#334155' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#cbd5e1', borderColor: '#334155' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', color: 'white', fontSize: 20, display: 'none' }} className="mobile-menu-btn">
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: '#0f2444', padding: '16px 24px', borderTop: '1px solid #1e3a5f' }}>
          {[['/', 'Home'], ['/courses', 'Courses'], ['/events', 'Events']].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: '#cbd5e1', padding: '10px 0', fontSize: 15 }}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
