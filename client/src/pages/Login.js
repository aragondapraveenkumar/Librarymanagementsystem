import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Navbar from '../components/Navbar';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastEl } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      showToast('Login successful!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid credentials', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Navbar />
      {ToastEl}

      <div className="glass auth-card" style={{ maxWidth:440, borderRadius:'1.75rem', padding:'2.5rem' }}>
        <h2 className="title-font" style={{ fontSize:'2.5rem', marginBottom:'0.25rem' }}>Welcome Back</h2>
        <p style={{ opacity:0.7, fontSize:'0.9rem', marginBottom:'2rem' }}>Login to access your dashboard</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Username</label>
            <input className="input-field" type="text" placeholder="Enter your username" required
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Password</label>
            <input className="input-field" type="password" placeholder="Enter your password" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>

          <button type="submit" className="btn-primary" style={{ width:'100%', padding:'1rem', fontSize:'1rem', marginTop:'0.5rem' }} disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="glass-light" style={{ marginTop:'1.5rem', padding:'1rem', borderRadius:'1rem', fontSize:'0.8rem' }}>
          <p style={{ fontWeight:700, marginBottom:'0.5rem', color:'#FFB347' }}>🔑 Demo Credentials</p>
          {[['admin','admin123','Admin'],['librarian','lib123','Librarian'],['student1','stud123','Student'],['faculty1','fac123','Faculty']].map(([u,p,r]) => (
            <div key={u} onClick={() => setForm({ username: u, password: p })}
              style={{ display:'flex', gap:'0.75rem', padding:'0.3rem 0.5rem', borderRadius:'0.5rem', cursor:'pointer', transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ opacity:0.5, width:70 }}>{u}</span>
              <span style={{ opacity:0.5, width:70 }}>{p}</span>
              <span style={{ color:'#FFD966', fontWeight:700, fontSize:'0.7rem' }}>{r}</span>
            </div>
          ))}
          <p style={{ opacity:0.5, fontSize:'0.7rem', marginTop:'0.5rem' }}>Click any row to autofill</p>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.9rem', opacity:0.8 }}>
          No account? <Link to="/register" style={{ color:'#FFB347', fontWeight:600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
