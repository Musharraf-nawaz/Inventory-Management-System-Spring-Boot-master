import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, Package2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminNav, mainNav } from '../config/nav';

export default function Layout() {
  const { username, roles, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = [...mainNav, ...(isAdmin ? adminNav : [])].find((n) =>
    n.to === '/' ? location.pathname === '/' : location.pathname.startsWith(n.to)
  );

  const initials = (username ?? 'U').slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Package2 size={22} />
          </div>
          <div>
            <h1>StockFlow</h1>
            <span>Inventory Suite</span>
          </div>
        </div>
        <p className="sidebar-section-label">Menu</p>
        <nav className="sidebar-nav">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <>
              <p className="sidebar-section-label">Administration</p>
              {adminNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-meta">
              <strong>{username}</strong>
              <span>{roles.join(' · ')}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-icon mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="topbar-title">{current?.label ?? 'Inventory'}</span>
          </div>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
