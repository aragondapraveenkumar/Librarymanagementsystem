import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { useToast } from '../hooks/useToast';
import * as api from '../api';

// ─── Student: Request Book ─────────────────────────────────────
export function RequestBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastEl } = useToast();

  useEffect(() => { api.getBooks().then(r=>setBooks(r.data)).finally(()=>setLoading(false)); }, []);

  const handleAction = async (action, book) => {
    if (action !== 'request') return;
    try { await api.makeRequest(book._id); showToast('Request submitted!'); }
    catch(err) { showToast(err.response?.data?.message||'Request failed', true); }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading...</p>;
  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'0.5rem' }}>✉️ Request a Book</h3>
      <p style={{ opacity:0.6, fontSize:'0.9rem', marginBottom:'1.25rem' }}>Browse available books and submit a request. Librarian will approve.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'1rem' }}>
        {books.filter(b=>b.availableCopies>0).map(b => <BookCard key={b._id} book={b} actionType="request" onAction={handleAction} />)}
      </div>
    </div>
  );
}

// ─── Faculty: Reserve Book (same as request) ──────────────────
export function ReserveBook() {
  const [books, setBooks] = useState([]);
  const { showToast, ToastEl } = useToast();

  useEffect(() => { api.getBooks().then(r=>setBooks(r.data)); }, []);

  const handleAction = async (action, book) => {
    if (action !== 'request') return;
    try { await api.makeRequest(book._id); showToast('Reservation submitted!'); }
    catch(err) { showToast(err.response?.data?.message||'Failed', true); }
  };

  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'0.5rem' }}>📌 Reserve Book (Faculty)</h3>
      <p style={{ opacity:0.6, fontSize:'0.9rem', marginBottom:'1.25rem' }}>Faculty members get 30-day borrowing period.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'1rem' }}>
        {books.filter(b=>b.availableCopies>0).map(b => <BookCard key={b._id} book={b} actionType="request" onAction={handleAction} />)}
      </div>
    </div>
  );
}

// ─── Faculty: Recommend Book ───────────────────────────────────
export function RecommendBook() {
  const [form, setForm] = useState({ title:'', author:'' });
  const [loading, setLoading] = useState(false);
  const { showToast, ToastEl } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.addRecommendation(form); showToast('Recommendation sent!'); setForm({ title:'', author:'' }); }
    catch(err) { showToast(err.response?.data?.message||'Failed', true); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:480 }}>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1.25rem' }}>💡 Recommend a New Book</h3>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Book Title *</label>
          <input className="input-field" placeholder="Book Title" required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
        </div>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Author *</label>
          <input className="input-field" placeholder="Author Name" required value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))} />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'SENDING...' : 'SEND RECOMMENDATION'}</button>
      </form>
    </div>
  );
}

// ─── Feedback Form (Student + Faculty) ────────────────────────
export function FeedbackForm() {
  const [form, setForm] = useState({ type:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const { showToast, ToastEl } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.postFeedback(form); showToast('Feedback submitted! ✅'); setForm({ type:'', subject:'', message:'' }); }
    catch(err) { showToast(err.response?.data?.message||'Failed', true); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:560 }}>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1.25rem' }}>📝 Send Feedback</h3>
      <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.75rem' }}>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Type *</label>
            <select className="input-field" required value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{ cursor:'pointer' }}>
              <option value="">Select type</option>
              <option value="Suggestion">💡 Suggestion</option>
              <option value="Complaint">⚠️ Complaint</option>
              <option value="Appreciation">👍 Appreciation</option>
              <option value="Issue">🔧 Technical Issue</option>
              <option value="Other">❓ Other</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Subject *</label>
            <input className="input-field" placeholder="Brief subject line" required value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} />
          </div>
          <div>
            <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Message *</label>
            <textarea className="input-field" placeholder="Your detailed feedback..." rows={5} required value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{ resize:'vertical' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding:'1rem', fontSize:'1rem' }} disabled={loading}>
            {loading ? 'SENDING...' : '✉️ SUBMIT FEEDBACK'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Admin: Manage Users ───────────────────────────────────────
export function ManageUsers({ onAddUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name:'', username:'', email:'', role:'', rollno:'', password:'' });
  const [saving, setSaving] = useState(false);
  const { showToast, ToastEl } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to load users', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      await api.deleteUser(user._id);
      showToast('User deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message||'Cannot delete', true);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || '',
      rollno: user.rollno || '',
      password: ''
    });
  };

  const set = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const payload = {
        name: editForm.name,
        username: editForm.username,
        email: editForm.email,
        role: editForm.role,
        rollno: editForm.rollno,
      };
      if (editForm.password.trim()) payload.password = editForm.password;
      await api.updateUser(editingUser._id, payload);
      showToast('User updated');
      setEditingUser(null);
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to update user', true);
    } finally {
      setSaving(false);
    }
  };

  const ROLE_COLOR = { Admin:'#FF6B6B', Librarian:'#FFD93D', Faculty:'#45B7D1', Student:'#4ECDC4' };

  const filteredUsers = users.filter(u => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [u.name, u.username, u.email, u.rollno, u.role]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q));
  });

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading users...</p>;
  return (
    <div>
      {ToastEl}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <h3 style={{ fontSize:'1.25rem', fontWeight:700 }}>All Users ({filteredUsers.length}/{users.length})</h3>
        <button onClick={onAddUser} className="btn-primary" style={{ padding:'0.6rem 1.25rem', fontSize:'0.85rem' }}>+ ADD USER</button>
      </div>

      <div style={{ marginBottom:'1rem' }}>
        <input
          className="input-field"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, username, email, roll no, or role"
          style={{ maxWidth:420 }}
        />
      </div>

      <div className="glass" style={{ borderRadius:'1.25rem', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'rgba(255,255,255,0.08)', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.05em', opacity:0.8 }}>
              {['Name','Username','Email','Roll No','Role','Action'].map(h=>(
                <th key={h} style={{ padding:'0.875rem 1rem', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u,i) => (
              <tr key={u._id} style={{ borderTop:'1px solid rgba(255,255,255,0.08)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                <td style={{ padding:'0.875rem 1rem', fontWeight:600 }}>{u.name}</td>
                <td style={{ padding:'0.875rem 1rem', opacity:0.75 }}>{u.username}</td>
                <td style={{ padding:'0.875rem 1rem', opacity:0.65, fontSize:'0.85rem' }}>{u.email}</td>
                <td style={{ padding:'0.875rem 1rem', opacity:0.65 }}>{u.rollno||'-'}</td>
                <td style={{ padding:'0.875rem 1rem' }}>
                  <span style={{ background:`${ROLE_COLOR[u.role]}25`, color:ROLE_COLOR[u.role], padding:'0.25rem 0.75rem', borderRadius:'2rem', fontSize:'0.75rem', fontWeight:700 }}>{u.role}</span>
                </td>
                <td style={{ padding:'0.875rem 1rem' }}>
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                    <button onClick={()=>openEdit(u)} style={{ background:'rgba(59,130,246,0.25)', color:'#93c5fd', border:'none', padding:'0.3rem 0.75rem', borderRadius:'0.5rem', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>Edit</button>
                    {!u.isDefault
                      ? <button onClick={()=>handleDelete(u)} style={{ background:'rgba(239,68,68,0.25)', color:'#fca5a5', border:'none', padding:'0.3rem 0.75rem', borderRadius:'0.5rem', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>Delete</button>
                      : <span style={{ opacity:0.4, fontSize:'0.75rem', alignSelf:'center' }}>System</span>
                    }
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding:'1.25rem', textAlign:'center', opacity:0.6 }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div onClick={() => setEditingUser(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div onClick={e=>e.stopPropagation()} className="glass" style={{ width:'90%', maxWidth:520, borderRadius:'1.75rem', padding:'2rem' }}>
            <h2 className="title-font" style={{ fontSize:'1.6rem', marginBottom:'1.25rem' }}>Edit User Details</h2>
            <form onSubmit={handleSaveEdit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <input className="input-field" placeholder="Full Name *" required value={editForm.name} onChange={e=>set('name',e.target.value)} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <input className="input-field" placeholder="Username *" required value={editForm.username} onChange={e=>set('username',e.target.value)} />
                <input className="input-field" type="email" placeholder="Email *" required value={editForm.email} onChange={e=>set('email',e.target.value)} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <select className="input-field" required value={editForm.role} onChange={e=>set('role',e.target.value)} style={{ cursor:'pointer' }}>
                  <option value="">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Admin">Admin</option>
                </select>
                <input className="input-field" placeholder="Roll No" value={editForm.rollno} onChange={e=>set('rollno',e.target.value)} />
              </div>
              <input className="input-field" type="password" placeholder="New Password (optional)" value={editForm.password} onChange={e=>set('password',e.target.value)} />
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
                <button type="button" className="btn-ghost" style={{ flex:1 }} onClick={() => setEditingUser(null)}>CANCEL</button>
                <button type="submit" className="btn-primary" style={{ flex:2 }} disabled={saving}>{saving ? 'UPDATING...' : 'SAVE CHANGES'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin: Reports ────────────────────────────────────────────
export function Reports() {
  const [data, setData] = useState(null);
  useEffect(() => { api.getReports().then(r=>setData(r.data)); }, []);
  if (!data) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading reports...</p>;

  return (
    <div>
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1.25rem' }}>📊 System Reports</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.25rem' }}>
        {[
          { icon:'👥', val:data.users, label:'Total Users', color:'#818cf8' },
          { icon:'📚', val:data.bookTitles, label:'Book Titles', color:'#34d399' },
          { icon:'📋', val:data.bookCopies, label:'Total Copies', color:'#60a5fa' },
          { icon:'✅', val:data.available, label:'Available Copies', color:'#4ade80' },
          { icon:'📤', val:data.activeIssues, label:'Active Issues', color:'#fb923c' },
          { icon:'⏳', val:data.requests, label:'Pending Requests', color:'#facc15' },
        ].map(s => (
          <div key={s.label} className="glass card-hover" style={{ borderRadius:'1.25rem', padding:'1.5rem', textAlign:'center', borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize:'2.5rem', fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:'0.85rem', opacity:0.8, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin: View Feedback ──────────────────────────────────────
export function ViewFeedback() {
  const [fb, setFb] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getFeedback().then(r=>setFb(r.data)).finally(()=>setLoading(false)); }, []);

  const TYPE_ICON = { Suggestion:'💡', Complaint:'⚠️', Appreciation:'👍', Issue:'🔧', Other:'❓' };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading...</p>;
  return (
    <div>
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>💬 User Feedback ({fb.length})</h3>
      {fb.length === 0
        ? <p style={{ textAlign:'center', opacity:0.6, padding:'3rem' }}>No feedback yet</p>
        : fb.map(f => (
          <div key={f._id} className="glass card-hover" style={{ borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'0.75rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <div>
                <h4 style={{ fontWeight:700, fontSize:'1.05rem' }}>{f.subject}</h4>
                <p style={{ fontSize:'0.75rem', opacity:0.6, marginTop:'0.25rem' }}>
                  From: <strong>{f.from}</strong> ({f.role}) ·
                  <span style={{ marginLeft:'0.5rem', background:'rgba(255,255,255,0.1)', padding:'0.1rem 0.5rem', borderRadius:'0.5rem' }}>{TYPE_ICON[f.type]} {f.type}</span>
                </p>
              </div>
              <span style={{ fontSize:'0.75rem', opacity:0.5 }}>{new Date(f.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={{ opacity:0.8, fontSize:'0.9rem', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'0.75rem' }}>{f.message}</p>
          </div>
        ))
      }
    </div>
  );
}

// ─── Admin: Add User Modal ─────────────────────────────────────
export function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name:'', username:'', email:'', role:'', rollno:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { showToast, ToastEl } = useToast();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { register } = await import('../api');
      await register(form);
      showToast(`User ${form.name} created!`);
      setTimeout(() => { onSuccess(); onClose(); }, 600);
    } catch(err) { showToast(err.response?.data?.message||'Failed', true); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
      {ToastEl}
      <div onClick={e=>e.stopPropagation()} className="glass" style={{ width:'90%', maxWidth:500, borderRadius:'1.75rem', padding:'2rem' }}>
        <h2 className="title-font" style={{ fontSize:'1.75rem', marginBottom:'1.5rem' }}>Add New User</h2>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <input className="input-field" placeholder="Full Name *" required value={form.name} onChange={e=>set('name',e.target.value)} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <input className="input-field" placeholder="Username *" required value={form.username} onChange={e=>set('username',e.target.value)} />
            <input className="input-field" type="email" placeholder="Email *" required value={form.email} onChange={e=>set('email',e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <select className="input-field" required value={form.role} onChange={e=>set('role',e.target.value)} style={{ cursor:'pointer' }}>
              <option value="">Select Role</option>
              <option value="Student">👨‍🎓 Student</option>
              <option value="Faculty">👨‍🏫 Faculty</option>
              <option value="Librarian">📚 Librarian</option>
              <option value="Admin">👔 Admin</option>
            </select>
            <input className="input-field" placeholder="Roll No" value={form.rollno} onChange={e=>set('rollno',e.target.value)} />
          </div>
          <input className="input-field" type="password" placeholder="Password *" required value={form.password} onChange={e=>set('password',e.target.value)} />
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
            <button type="button" className="btn-ghost" style={{ flex:1 }} onClick={onClose}>CANCEL</button>
            <button type="submit" className="btn-primary" style={{ flex:2 }} disabled={loading}>{loading?'CREATING...':'CREATE USER'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

