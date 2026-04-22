import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Welcome, Profile, SearchCatalog, MyBooks } from './DashboardViews';
import { BookForm, ManageBooks, IssueBook, Returns, Requests, RecommendationsView } from './LibrarianViews';
import { RequestBook, ReserveBook, RecommendBook, FeedbackForm, ManageUsers, Reports, ViewFeedback, AddUserModal } from './OtherViews';
import * as api from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastEl } = useToast();

  const [view, setView] = useState('welcome');
  const [editingBook, setEditingBook] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.getBooks().then(r => setBooks(r.data)).catch(() => {});
    api.getMyBooks().then(r => setMyIssues(r.data)).catch(() => {});
    if (user.role === 'Librarian' || user.role === 'Admin') {
      api.getIssues().then(r => setIssues(r.data)).catch(() => {});
      api.getRequests().then(r => setRequests(r.data)).catch(() => {});
    }
  }, [user, navigate]);

  const handleNav = (key) => {
    if (key === 'backup') { handleBackup(); return; }
    if (key === 'restore') { handleRestore(); return; }
    setEditingBook(null);
    setView(key);
  };

  const handleBackup = async () => {
    try {
      const [u, b, i, r, recs] = await Promise.all([
        api.getUsers(), api.getBooks(), api.getIssues(), api.getRequests(), api.getRecommendations()
      ]);
      const data = { users: u.data, books: b.data, issues: i.data, requests: r.data, recommendations: recs.data };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = `vemu-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      showToast('Backup downloaded!');
    } catch {
      showToast('Backup failed', true);
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          JSON.parse(ev.target.result);
          showToast('Restore: Please import data via MongoDB directly or use the API.');
        } catch {
          showToast('Invalid backup file', true);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const VIEW_TITLES = {
    welcome: ['Dashboard', `Welcome back, ${user?.name?.split(' ')[0]}!`],
    profile: ['My Profile', 'Manage your account information'],
    search: ['Search Catalog', 'Discover books by title, author, or subject'],
    mybooks: ['My Books', 'Books currently borrowed'],
    addbook: ['Add New Book', 'Add books to the library collection'],
    editbook: ['Edit Book', editingBook ? `Editing: ${editingBook.title}` : ''],
    managebooks: ['Manage Books', `${books.length} books in collection`],
    issue: ['Issue Book', 'Issue books to students and faculty'],
    returns: ['Returns & Fines', 'Process book returns and manage fines'],
    requests: ['Pending Requests', `${requests.length} requests awaiting approval`],
    recs: ['Recommendations', 'Community book suggestions'],
    request: ['Request a Book', 'Submit a request for librarian approval'],
    reserve: ['Reserve Book', 'Reserve books for extended borrowing'],
    recommend: ['Recommend a Book', 'Suggest new books for the library'],
    feedback: ['Send Feedback', 'Share your thoughts and suggestions'],
    users: ['Manage Users', 'All registered users'],
    reports: ['System Reports', 'Library statistics and analytics'],
    feedbackview: ['User Feedback', 'All feedback received'],
  };

  const [title, subtitle] = VIEW_TITLES[view] || ['Dashboard', ''];

  const renderView = () => {
    if (view === 'welcome') return <Welcome user={user} books={books} issues={issues} requests={requests} />;
    if (view === 'profile') return <Profile user={user} myIssues={myIssues} myRequests={myRequests} />;
    if (view === 'search') return <SearchCatalog user={user} />;
    if (view === 'mybooks') return <MyBooks user={user} />;
    if (view === 'addbook') return <BookForm onSuccess={() => setView('managebooks')} />;
    if (view === 'editbook') return <BookForm editBook={editingBook} onSuccess={() => { setEditingBook(null); setView('managebooks'); }} onCancel={() => setView('managebooks')} />;
    if (view === 'managebooks') return <ManageBooks onEdit={(b) => { setEditingBook(b); setView('editbook'); }} />;
    if (view === 'issue') return <IssueBook />;
    if (view === 'returns') return <Returns />;
    if (view === 'requests') return <Requests />;
    if (view === 'recs') return <RecommendationsView />;
    if (view === 'request') return <RequestBook />;
    if (view === 'reserve') return <ReserveBook />;
    if (view === 'recommend') return <RecommendBook />;
    if (view === 'feedback') return <FeedbackForm />;
    if (view === 'users') return <ManageUsers onAddUser={() => setShowAddUser(true)} />;
    if (view === 'reports') return <Reports />;
    if (view === 'feedbackview') return <ViewFeedback />;
    return null;
  };

  if (!user) return null;

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar />
      {ToastEl}
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={() => setView('users')} />}

      <div className="page-shell dashboard-shell" style={{ paddingBottom:'2rem' }}>
        <div className="dashboard-layout">
          <Sidebar active={view} onNav={handleNav} />

          <div className="dashboard-content">
            <div className="dashboard-header-card">
              <div>
                <div className="dashboard-eyebrow">
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#7dd3fc', display:'inline-block' }} />
                  VEMU Library Workspace
                </div>
                <h2 className="title-font" style={{ fontSize:'2.5rem' }}>{title}</h2>
                <p style={{ opacity:0.65, fontSize:'0.9rem', marginTop:'0.25rem' }}>{subtitle}</p>
              </div>
              <div className="dashboard-user-chip">
                <div style={{ width:38, height:38, borderRadius:'999px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,rgba(125,211,252,0.35),rgba(251,191,36,0.35))', border:'1px solid rgba(255,255,255,0.18)' }}>
                  ðŸ‘¤
                </div>
                <div>
                  <div style={{ fontSize:'0.86rem', fontWeight:700 }}>{user.name}</div>
                  <div style={{ color:'#FFD966', fontWeight:700, fontSize:'0.68rem', letterSpacing:'0.08em' }}>{user.role.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div className="glass dashboard-main-panel">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
