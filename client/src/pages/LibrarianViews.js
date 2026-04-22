import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import IssuedBookCard from '../components/IssuedBookCard';
import { useToast } from '../hooks/useToast';
import * as api from '../api';

// ─── Add / Edit Book ───────────────────────────────────────────
export function BookForm({ editBook, onSuccess, onCancel }) {
  const isEdit = !!editBook;
  const [form, setForm] = useState({
    title: editBook?.title||'', author: editBook?.author||'', edition: editBook?.edition||'',
    subject: editBook?.subject||'', isbn: editBook?.isbn||'', totalCopies: editBook?.totalCopies||5, imageBase64: null
  });
  const [loading, setLoading] = useState(false);
  const { showToast, ToastEl } = useToast();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('imageBase64', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, totalCopies: parseInt(form.totalCopies)||1 };
      if (isEdit) { await api.updateBook(editBook._id, payload); showToast(`"${form.title}" updated!`); }
      else { await api.addBook(payload); showToast(`"${form.title}" added!`); }
      onSuccess();
    } catch (err) { showToast(err.response?.data?.message||'Failed', true); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.5rem', fontWeight:700, marginBottom:'1.25rem' }}>{isEdit ? '📝 Edit Book' : '📕 Add New Book'}</h3>
      <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Book Title *</label>
          <input className="input-field" placeholder="Book Title" required value={form.title} onChange={e=>set('title',e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Author *</label>
          <input className="input-field" placeholder="Author Name" required value={form.author} onChange={e=>set('author',e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Edition</label>
          <input className="input-field" placeholder="e.g. 2nd" value={form.edition} onChange={e=>set('edition',e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Subject *</label>
          <input className="input-field" placeholder="Subject/Category" required value={form.subject} onChange={e=>set('subject',e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>ISBN *</label>
          <input className="input-field" placeholder="ISBN" required value={form.isbn} onChange={e=>set('isbn',e.target.value)} />
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Total Copies</label>
          <input className="input-field" type="number" min="1" value={form.totalCopies} onChange={e=>set('totalCopies',e.target.value)} style={{ width:200 }} />
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Cover Image (optional)</label>
          <input className="input-field" type="file" accept="image/*" onChange={handleImage} />
        </div>
        <div style={{ gridColumn:'1/-1', display:'flex', gap:'0.75rem' }}>
          {onCancel && <button type="button" className="btn-ghost" onClick={onCancel} style={{ flex:1 }}>CANCEL</button>}
          <button type="submit" className="btn-primary" style={{ flex:2 }} disabled={loading}>
            {loading ? 'SAVING...' : isEdit ? '💾 UPDATE BOOK' : '➕ ADD BOOK'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Manage Books ──────────────────────────────────────────────
export function ManageBooks({ onEdit }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastEl } = useToast();

  const load = () => api.getBooks().then(r=>setBooks(r.data)).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const handleAction = async (action, book) => {
    if (action === 'edit') { onEdit(book); return; }
    if (action === 'delete') {
      if (!window.confirm(`Delete "${book.title}"?`)) return;
      try { await api.deleteBook(book._id); showToast('Book deleted'); load(); }
      catch(err) { showToast(err.response?.data?.message||'Failed', true); }
    }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading books...</p>;
  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>📚 Manage Books ({books.length})</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'1rem' }}>
        {books.map(b => <BookCard key={b._id} book={b} actionType="manage" onAction={handleAction} />)}
      </div>
    </div>
  );
}

// ─── Issue Book ────────────────────────────────────────────────
export function IssueBook() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [issueNotice, setIssueNotice] = useState(null);
  const { showToast, ToastEl } = useToast();

  useEffect(() => {
    api.getBooks().then(r => setBooks(r.data.filter(b=>b.availableCopies>0)));
    api.getUsers().then(r => {
      const eligible = r.data.filter(u=>u.role==='Student'||u.role==='Faculty');
      setUsers(eligible);
      if (eligible.length) setSelectedUser(eligible[0]._id);
    }).catch(err => {
      showToast(err.response?.data?.message || 'Unable to load users', true);
      setUsers([]);
      setSelectedUser('');
    }).finally(() => setLoadingUsers(false));
  }, [showToast]);

  const handleAction = (action, book) => {
    if (action === 'select-issue') { setSelectedBook(book); showToast(`Selected: ${book.title}`); }
  };

  const confirmIssue = async () => {
    if (!selectedBook) return showToast('Select a book first', true);
    if (!selectedUser) return showToast('Select a user', true);
    try {
      const res = await api.issueBook({ bookId: selectedBook._id, userId: selectedUser });
      const issuedTo = users.find(u => u._id === selectedUser);
      const nextNotice = {
        title: selectedBook.title,
        userName: issuedTo?.name || 'Selected user',
        role: issuedTo?.role || '',
        dueDate: new Date(res.data.dueDate).toLocaleDateString()
      };
      setIssueNotice(nextNotice);
      showToast(`Issued "${selectedBook.title}" to ${nextNotice.userName}`);
      setSelectedBook(null);
      api.getBooks().then(r => setBooks(r.data.filter(b=>b.availableCopies>0)));
    } catch(err) { showToast(err.response?.data?.message||'Issue failed', true); }
  };

  return (
    <div>
      {ToastEl}
      <div className="split-layout">
        <div>
          <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>📤 Select Book to Issue</h3>
          <div className="wide-card-grid">
            {books.map(b => (
              <div key={b._id} style={{ outline: selectedBook?._id===b._id ? '2px solid #6366f1' : 'none', borderRadius:'1.25rem' }}>
                <BookCard book={b} actionType="issue" onAction={handleAction} />
              </div>
            ))}
          </div>
        </div>
        <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem', alignSelf:'start', position:'sticky', top:80 }}>
          <h4 style={{ fontWeight:700, marginBottom:'1rem' }}>Issue Details</h4>
          {issueNotice && (
            <div className="issue-notice">
              <p style={{ fontWeight:700, marginBottom:'0.35rem' }}>Book issued successfully</p>
              <p style={{ fontSize:'0.88rem', opacity:0.92 }}>
                <strong>{issueNotice.title}</strong> was issued to <strong>{issueNotice.userName}</strong>{issueNotice.role ? ` (${issueNotice.role})` : ''}.
              </p>
              <p style={{ fontSize:'0.8rem', opacity:0.8, marginTop:'0.35rem' }}>Due date: {issueNotice.dueDate}</p>
            </div>
          )}
          {selectedBook && (
            <div style={{ background:'rgba(99,102,241,0.2)', borderRadius:'0.875rem', padding:'0.75rem', marginBottom:'1rem', fontSize:'0.85rem' }}>
              📘 <strong>{selectedBook.title}</strong>
            </div>
          )}
          <label style={{ fontSize:'0.7rem', textTransform:'uppercase', opacity:0.8, display:'block', marginBottom:'0.5rem' }}>Select User</label>
          <select
            className="input-field"
            value={selectedUser}
            onChange={e=>setSelectedUser(e.target.value)}
            style={{ marginBottom:'1rem', cursor:'pointer' }}
            disabled={loadingUsers || users.length === 0}
          >
            {loadingUsers && <option value="">Loading users...</option>}
            {!loadingUsers && users.length === 0 && <option value="">No students or faculty available</option>}
            {users.map(u=><option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
          </select>
          <button onClick={confirmIssue} className="btn-primary" style={{ width:'100%', background:'linear-gradient(135deg,#22c55e,#16a34a)' }} disabled={!selectedBook || !selectedUser || loadingUsers}>
            ✓ CONFIRM ISSUE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Returns & Fines ───────────────────────────────────────────
export function Returns() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastEl } = useToast();

  const load = () => api.getIssues().then(r=>setIssues(r.data)).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const handleReturn = async (id) => {
    try {
      const res = await api.returnBook(id);
      showToast(res.data.fine ? `Returned. Fine: ₹${res.data.fine}` : 'Returned on time! ✅');
      load();
    } catch(err) { showToast(err.response?.data?.message||'Failed', true); }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading...</p>;
  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>📥 Returns & Fines ({issues.length} active)</h3>
      {issues.length === 0
        ? <p style={{ textAlign:'center', opacity:0.6, padding:'3rem' }}>No active loans</p>
        : issues.map(item => <IssuedBookCard key={item._id} item={item} showReturn={true} onReturn={handleReturn} />)
      }
    </div>
  );
}

// ─── Pending Requests ──────────────────────────────────────────
export function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastEl } = useToast();

  const load = () => api.getRequests().then(r=>setRequests(r.data)).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const approve = async (id) => {
    try { await api.approveRequest(id); showToast('Approved ✅'); load(); }
    catch(err) { showToast(err.response?.data?.message||'Failed', true); }
  };
  const reject = async (id) => {
    try { await api.rejectRequest(id); showToast('Rejected'); load(); }
    catch(err) { showToast('Failed', true); }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading...</p>;
  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>⏳ Pending Requests ({requests.length})</h3>
      {requests.length === 0
        ? <p style={{ textAlign:'center', opacity:0.6, padding:'3rem' }}>No pending requests</p>
        : requests.map(r => (
          <div key={r._id} className="glass card-hover" style={{ borderRadius:'1.25rem', padding:'1.25rem', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            <div>
              <strong style={{ fontSize:'1.05rem' }}>{r.bookId?.title || 'Book'}</strong>
              <p style={{ fontSize:'0.8rem', opacity:0.6, marginTop:'0.25rem' }}>
                Requested by <strong>{r.username}</strong> · {new Date(r.requestDate).toLocaleDateString()} · Role: {r.userId?.role || '—'}
              </p>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={()=>approve(r._id)} className="btn-primary" style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)', padding:'0.5rem 1.25rem', fontSize:'0.85rem' }}>Approve</button>
              <button onClick={()=>reject(r._id)} className="btn-ghost" style={{ padding:'0.5rem 1.25rem', fontSize:'0.85rem' }}>Reject</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── Recommendations (Librarian view) ─────────────────────────
export function RecommendationsView() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastEl } = useToast();

  const load = () => api.getRecommendations().then(r=>setRecs(r.data)).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const archive = async (id) => {
    try { await api.archiveRec(id); showToast('Archived'); load(); }
    catch { showToast('Failed', true); }
  };

  if (loading) return <p style={{ textAlign:'center', padding:'3rem', opacity:0.6 }}>Loading...</p>;
  return (
    <div>
      {ToastEl}
      <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'1rem' }}>⭐ Book Recommendations ({recs.length})</h3>
      {recs.length === 0
        ? <p style={{ textAlign:'center', opacity:0.6, padding:'3rem' }}>No recommendations yet</p>
        : recs.map(r => (
          <div key={r._id} className="glass card-hover" style={{ borderRadius:'1.25rem', padding:'1.25rem', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            <div>
              <strong>{r.title}</strong> <span style={{ opacity:0.7 }}>by {r.author}</span>
              <p style={{ fontSize:'0.75rem', opacity:0.6, marginTop:'0.25rem' }}>Suggested by {r.suggestedBy} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={()=>archive(r._id)} className="btn-ghost" style={{ padding:'0.5rem 1rem', fontSize:'0.8rem' }}>Archive</button>
          </div>
        ))
      }
    </div>
  );
}
