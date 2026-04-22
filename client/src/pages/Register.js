import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useToast } from '../hooks/useToast';
import Navbar from '../components/Navbar';

export default function Register() {
  const [form, setForm] = useState({ name:'', username:'', email:'', role:'', rollno:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, ToastEl } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return showToast('Passwords do not match!', true);
    setLoading(true);
    try {
      await register({ name: form.name, username: form.username, email: form.email, role: form.role, rollno: form.rollno, password: form.password });
      showToast(`Account created for ${form.name}!`);
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Navbar />
      {ToastEl}

      <div className="glass auth-card" style={{ maxWidth:520, borderRadius:'1.75rem', padding:'2.5rem' }}>
        <h2 className="title-font" style={{ fontSize:'2.5rem', marginBottom:'0.25rem' }}>Create Account</h2>
        <p style={{ opacity:0.7, fontSize:'0.9rem', marginBottom:'2rem' }}>Join the VEMU digital library ecosystem</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Full Name *</label>
            <input className="input-field" placeholder="Your full name" required value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Username *</label>
              <input className="input-field" placeholder="Choose username" required value={form.username} onChange={e => set('username', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Email *</label>
              <input className="input-field" type="email" placeholder="your@email.com" required value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Role *</label>
              <select className="input-field" required value={form.role} onChange={e => set('role', e.target.value)} style={{ cursor:'pointer' }}>
                <option value="">Select role</option>
                <option value="Student">👨‍🎓 Student</option>
                <option value="Faculty">👨‍🏫 Faculty</option>
                <option value="Librarian">📚 Librarian</option>
                <option value="Admin">👔 Admin</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Roll No *</label>
              <input className="input-field" placeholder="Roll number" required value={form.rollno} onChange={e => set('rollno', e.target.value)} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Password *</label>
              <input className="input-field" type="password" placeholder="Strong password" required value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Confirm *</label>
              <input className="input-field" type="password" placeholder="Confirm password" required value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
          </div>

          <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
            <button type="button" className="btn-ghost" style={{ flex:1 }} onClick={() => navigate('/')}>CANCEL</button>
            <button type="submit" className="btn-primary" style={{ flex:2 }} disabled={loading}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </div>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.9rem', opacity:0.8 }}>
          Already have an account? <Link to="/login" style={{ color:'#FFB347', fontWeight:600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
