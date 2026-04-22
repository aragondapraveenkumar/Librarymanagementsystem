import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar
        showAuthButtons
        onAboutClick={() => setAboutOpen(true)}
        onContactClick={() => setContactOpen(true)}
      />

      {/* Hero */}
      <div className="page-shell">
        <div className="home-hero">
          <div style={{ textAlign:'center', maxWidth:700, padding:'2rem 0 3rem' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', borderRadius:'2rem', padding:'0.5rem 1.25rem', marginBottom:'2rem', border:'1px solid rgba(255,255,255,0.25)', fontSize:'0.85rem', fontWeight:600 }}>
              <span style={{ width:8, height:8, background:'#FFB347', borderRadius:'50%', display:'inline-block', animation:'pulse 1.5s infinite' }}></span>
              WELCOME TO VEMU DIGITAL LIBRARY
            </div>

            <h1 className="title-font" style={{ fontSize:'clamp(3rem,8vw,5rem)', lineHeight:1.1, marginBottom:'1.5rem' }}>
              Library<br/>Management<br/>System
            </h1>

            <p style={{ fontSize:'1.1rem', opacity:0.85, marginBottom:'2.5rem', fontWeight:500 }}>
              A modern, secure platform for managing your academic library
            </p>

            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding:'1rem 2.5rem', fontSize:'1rem', background:'linear-gradient(135deg,#22c55e,#0d9488)' }}>
                GET STARTED
              </button>
              <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding:'1rem 2.5rem', fontSize:'1rem', borderWidth:2 }}>
                SIGN IN
              </button>
            </div>

            {/* Feature badges */}
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginTop:'3rem' }}>
              {['4 Role Access','Book Catalog','Issue & Return','Fine Calculation','Backup & Restore'].map(f => (
                <span key={f} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'2rem', padding:'0.4rem 1rem', fontSize:'0.78rem', fontWeight:600 }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {aboutOpen && (
        <div onClick={() => setAboutOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()} className="glass" style={{ maxWidth:560, width:'90%', borderRadius:'1.5rem', padding:'2rem' }}>
            <h2 className="title-font" style={{ fontSize:'1.75rem', marginBottom:'0.5rem' }}>About the Library System</h2>
            <p style={{ opacity:0.8, fontSize:'0.9rem', lineHeight:1.7, marginBottom:'1.5rem' }}>
              VEMU Department Library Management System delivers complete role-based access, secure authentication, book catalog, issue/return with fine calculation, reporting, backup/restore, and recommendation engine.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
              <div><strong style={{ color:'#FFB347' }}>Features</strong><br/>• Role-based access (4 roles)<br/>• Real-time data<br/>• Fine calculation<br/>• Book recommendations</div>
              <div><strong style={{ color:'#FFB347' }}>Tech Stack</strong><br/>• React + Node.js<br/>• MongoDB database<br/>• JWT authentication<br/>• REST API</div>
            </div>
            <button onClick={() => setAboutOpen(false)} className="btn-ghost" style={{ width:'100%' }}>CLOSE</button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div onClick={() => setContactOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()} className="glass" style={{ maxWidth:400, width:'90%', borderRadius:'1.5rem', padding:'2rem' }}>
            <h2 className="title-font" style={{ fontSize:'1.75rem', marginBottom:'0.5rem' }}>Contact Us</h2>
            <p style={{ opacity:0.6, fontSize:'0.85rem', marginBottom:'1.5rem' }}>Department Library Office</p>
            {[['Email','library@vemu.edu'],['Phone','+91-98765-43210'],['Location','Central Block, VEMU Campus'],['Hours','9 AM – 5 PM (Mon–Sat)']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid rgba(255,255,255,0.1)', fontSize:'0.9rem' }}>
                <span style={{ opacity:0.6 }}>{k}:</span><span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setContactOpen(false)} className="btn-ghost" style={{ width:'100%', marginTop:'1.5rem' }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
