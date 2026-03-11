import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentMenu = [
  { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
  { path: '/my-courses', icon: 'fa-book-open', label: 'My Courses' },
  { path: '/certificates', icon: 'fa-certificate', label: 'Certificates' },
  { path: '/profile', icon: 'fa-user', label: 'Profile' },
];

const AdminMenu = [
  { path: '/admin', icon: 'fa-chart-pie', label: 'Dashboard' },
  { path: '/admin/users', icon: 'fa-users', label: 'Users' },
  { path: '/admin/courses', icon: 'fa-graduation-cap', label: 'Courses' },
  { path: '/admin/course-content', icon: 'fa-layer-group', label: 'Course Content' },
  { path: '/admin/enrollments', icon: 'fa-clipboard-list', label: 'Enrollments' },
  { path: '/admin/quizzes', icon: 'fa-question-circle', label: 'Quizzes' },
  { path: '/admin/events', icon: 'fa-calendar-alt', label: 'Events' },
  { path: '/admin/certificates', icon: 'fa-certificate', label: 'Certificates' },
  { path: '/admin/analytics', icon: 'fa-chart-bar', label: 'Analytics' },
  { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menu = user?.role === 'admin' ? AdminMenu : StudentMenu;

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 100,
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
    }}>
      <div style={{ padding: collapsed ? '20px 0' : '20px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="Bramolyness" style={{ height: 32 }} />
           <span style={{ color: 'white', fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 700 }}>Bramolyness</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', color: '#64748b', fontSize: 14, padding: 4 }}>
          <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e3a5f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1a3c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{user?.name?.charAt(0)}</div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: '#64748b', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: collapsed ? '12px 0' : '12px 12px', overflowY: 'auto' }}>
        {menu.map(item => (
          <Link key={item.path} to={item.path} title={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px 0' : '11px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: collapsed ? 0 : 8,
            marginBottom: 2,
            color: isActive(item.path) ? 'white' : 'var(--sidebar-text)',
            background: isActive(item.path) ? 'var(--sidebar-active)' : 'transparent',
            fontSize: 14, fontWeight: isActive(item.path) ? 600 : 400,
            transition: 'all 0.2s'
          }}>
            <i className={`fas ${item.icon}`} style={{ fontSize: 15, width: 18, textAlign: 'center' }}></i>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: collapsed ? '12px 0' : '12px 12px', borderTop: '1px solid #1e3a5f' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px 0' : '11px 14px',
          justifyContent: collapsed ? 'center' : 'flex-start', width: '100%',
          background: 'none', color: '#ef4444', fontSize: 14, fontWeight: 500,
          borderRadius: 8, transition: 'background 0.2s'
        }}>
          <i className="fas fa-sign-out-alt" style={{ fontSize: 15, width: 18, textAlign: 'center' }}></i>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}
