import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ marginLeft: collapsed ? 64 : 240, flex: 1, padding: '32px', transition: 'margin-left 0.3s', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
