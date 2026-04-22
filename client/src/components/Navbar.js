import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ showAuthButtons = false, onAboutClick, onContactClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'linear-gradient(90deg,rgba(15,15,40,0.85),rgba(60,20,80,0.7),rgba(15,15,40,0.85))',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
    }}>
      <div className="page-shell" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}>🏛️</div>
          <h1 className="title-font" style={{ fontSize: '1.5rem' }}>VEMU LIBRARY SYSTEM</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.15)', borderRadius: '2rem',
                padding: '0.4rem 1rem', border: '1px solid rgba(255,255,255,0.25)',
                fontSize: '0.8rem'
              }}>
                👤 <span>{user.name}</span>
                <span style={{ color: '#FFD966', fontWeight: 700, fontSize: '0.7rem' }}>{user.role.toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg,#ef4444,#ec4899)', fontSize: '0.8rem' }}>
                LOGOUT
              </button>
            </>
          ) : showAuthButtons ? (
            <>
              {onAboutClick ? (
                <button onClick={onAboutClick} className="btn-ghost" style={{ padding: '0.5rem 1.5rem' }}>ABOUT</button>
              ) : null}
              {onContactClick ? (
                <button onClick={onContactClick} className="btn-ghost" style={{ padding: '0.5rem 1.5rem' }}>CONTACT</button>
              ) : null}
              <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '0.5rem 1.5rem' }}>LOGIN</button>
              <button onClick={() => navigate('/register')} style={{ background: 'white', color: '#1e1a3a', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: '2rem', border: 'none', cursor: 'pointer' }}>REGISTER</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
