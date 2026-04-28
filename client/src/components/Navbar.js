import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ showAuthButtons = false, onAboutClick, onContactClick, onInfoClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const infoItems = ['Features', 'Catalogue', 'Academics', 'Departments'];

  return (
    <nav style={{
      background: '#14532d',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #166534',
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      boxShadow: '0 4px 24px rgba(20,83,45,0.35)'
    }}>
      <div className="page-shell" style={{ paddingTop: '1rem', paddingBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/vemu-logo.png"
            alt="VEMU Logo"
            style={{
              width: 44,
              height: 44,
              objectFit: 'contain',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.2rem'
            }}
          />
          <h1 className="title-font" style={{ fontSize: '1.5rem' }}>VEMU LIBRARY SYSTEM</h1>
        </div>

        {!user && showAuthButtons ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {infoItems.map((item) => (
              <span
                key={item}
                onClick={() => onInfoClick && onInfoClick(item)}
                style={{ fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', opacity: 0.9 }}
              >
                {item}
              </span>
            ))}
            {onAboutClick ? (
              <span
                onClick={onAboutClick}
                style={{ fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', opacity: 0.9 }}
              >
                About
              </span>
            ) : null}
            {onContactClick ? (
              <span
                onClick={onContactClick}
                style={{ fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', opacity: 0.9 }}
              >
                Contact
              </span>
            ) : null}
          </div>
        ) : <div />}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.15)', borderRadius: '2rem',
                padding: '0.4rem 1rem', border: '1px solid rgba(255,255,255,0.25)',
                fontSize: '0.8rem'
              }}>
                <span>{user.name}</span>
                <span style={{ color: '#FFD966', fontWeight: 700, fontSize: '0.7rem' }}>{user.role.toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg,#ef4444,#ec4899)', fontSize: '0.8rem' }}>
                LOGOUT
              </button>
            </>
          ) : showAuthButtons ? (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
                }}
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '0.65rem',
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'linear-gradient(135deg,#fef08a,#facc15)',
                  color: '#14532d',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 18px rgba(250,204,21,0.35)'
                }}
              >
                REGISTER
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
