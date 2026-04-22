import React from 'react';
import { useAuth } from '../context/AuthContext';

const MENU = {
  common: [
    { key:'welcome',  icon:'🏠', label:'DASHBOARD' },
    { key:'profile',  icon:'👤', label:'MY PROFILE' },
    { key:'search',   icon:'🔎', label:'SEARCH CATALOG' },
    { key:'mybooks',  icon:'📖', label:'MY BORROWED BOOKS' },
  ],
  Student: [
    { key:'request',  icon:'✉️', label:'REQUEST BOOK' },
    { key:'feedback', icon:'💬', label:'SEND FEEDBACK' },
  ],
  Faculty: [
    { key:'reserve',   icon:'📌', label:'RESERVE BOOK' },
    { key:'recommend', icon:'💡', label:'RECOMMEND' },
    { key:'feedback',  icon:'💬', label:'SEND FEEDBACK' },
  ],
  Librarian: [
    { key:'addbook',      icon:'📕', label:'ADD BOOK' },
    { key:'managebooks',  icon:'📚', label:'MANAGE BOOKS' },
    { key:'issue',        icon:'📤', label:'ISSUE BOOK' },
    { key:'returns',      icon:'📥', label:'RETURN & FINES' },
    { key:'requests',     icon:'⏳', label:'REQUESTS' },
    { key:'recs',         icon:'⭐', label:'RECOMMENDATIONS' },
  ],
  Admin: [
    { key:'users',       icon:'👥', label:'MANAGE USERS' },
    { key:'reports',     icon:'📊', label:'OVERALL REPORTS' },
    { key:'feedbackview',icon:'💬', label:'VIEW FEEDBACK' },
    { key:'backup',      icon:'💾', label:'BACKUP' },
    { key:'restore',     icon:'♻️', label:'RESTORE' },
  ],
};

export default function Sidebar({ active, onNav }) {
  const { user } = useAuth();
  if (!user) return null;

  const roleItems = MENU[user.role] || [];

  return (
    <div className="glass dashboard-sidebar" style={{ borderRadius:'1.75rem', padding:'1rem', height:'calc(100vh - 100px)', overflowY:'auto', position:'sticky', top:80 }}>
      <div className="soft-panel" style={{ marginBottom:'0.85rem', padding:'1rem' }}>
        <p style={{ fontSize:'0.68rem', textTransform:'uppercase', color:'#FFB347', fontWeight:700, letterSpacing:'0.12em', marginBottom:'0.35rem' }}>Workspace</p>
        <h3 className="title-font" style={{ fontSize:'1.15rem', marginBottom:'0.25rem' }}>{user.role} Desk</h3>
        <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.68)' }}>Navigate library operations with a cleaner, role-based view.</p>
      </div>
      <p style={{ fontSize:'0.7rem', textTransform:'uppercase', color:'#FFB347', fontWeight:700, padding:'0.35rem 0.75rem', marginBottom:'0.5rem', letterSpacing:'0.1em' }}>Main Menu</p>
      {MENU.common.map(item => (
        <button key={item.key} className={`sidebar-btn ${active === item.key ? 'active' : ''}`} onClick={() => onNav(item.key)}>
          <span>{item.icon}</span>{item.label}
        </button>
      ))}

      {roleItems.length > 0 && (
        <>
          <p style={{ fontSize:'0.7rem', textTransform:'uppercase', color:'#FFB347', fontWeight:700, padding:'0.75rem 0.75rem 0.5rem', marginTop:'0.5rem', letterSpacing:'0.1em' }}>
            {user.role.toUpperCase()} ZONE
          </p>
          {roleItems.map(item => (
            <button key={item.key} className={`sidebar-btn ${active === item.key ? 'active' : ''}`} onClick={() => onNav(item.key)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
