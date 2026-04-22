import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import IssuedBookCard from '../components/IssuedBookCard';
import { useToast } from '../hooks/useToast';
import * as api from '../api';

function Welcome({ user, books, issues, requests }) {
  const stats = [
    {
      icon: '📖',
      val: books.length,
      label: 'Titles in Catalog',
      sub: `${books.reduce((a, b) => a + b.availableCopies, 0)} copies available`,
      accent: '#7dd3fc'
    },
    {
      icon: '📤',
      val: issues.filter(i => !i.returned).length,
      label: 'Active Loans',
      sub: 'Tracked across all users',
      accent: '#86efac'
    },
    {
      icon: '⏳',
      val: requests.length,
      label: 'Open Requests',
      sub: 'Waiting for action',
      accent: '#fcd34d'
    },
  ];

  return (
    <div>
      <div
        className="glass"
        style={{
          borderRadius: '1.75rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(125,211,252,0.12), rgba(251,191,36,0.08) 55%, rgba(244,114,182,0.08))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="dashboard-eyebrow" style={{ marginBottom: '0.9rem' }}>Today&apos;s Overview</div>
            <h2 className="title-font" style={{ fontSize: 'clamp(2.2rem,4vw,3.25rem)', marginBottom: '0.45rem' }}>
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className="section-subtle" style={{ maxWidth: 560 }}>
              A polished control center for circulation, requests, catalog health, and daily library activity.
            </p>
          </div>
          <div className="soft-panel" style={{ minWidth: 220 }}>
            <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '0.35rem' }}>
              Signed in as
            </p>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user.role}</div>
            <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.68)' }}>Library operations dashboard</div>
          </div>
        </div>
      </div>

      <div className="section-grid-auto" style={{ marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="dashboard-stat-card card-hover">
            <div className="dashboard-stat-row">
              <div className="dashboard-icon-badge">{s.icon}</div>
              <div style={{ color: s.accent, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Live
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '1rem' }}>{s.val}</div>
            <div style={{ fontWeight: 700, opacity: 0.96, marginTop: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.66)', marginTop: '0.35rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ user, myIssues, myRequests }) {
  return (
    <div className="split-layout">
      <div className="glass" style={{ borderRadius: '1.7rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '1.25rem',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              flexShrink: 0
            }}
          >
            👤
          </div>
          <div>
            <div className="dashboard-eyebrow" style={{ marginBottom: '0.55rem' }}>Member Profile</div>
            <h3 className="title-font" style={{ fontSize: '2rem' }}>{user.name}</h3>
            <p style={{ color: '#93c5fd', fontWeight: 600 }}>@{user.username}</p>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              Role: <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{user.role}</span>
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
          {[
            ['Full Name', user.name],
            ['Username', user.username],
            ['Email', user.email],
            ['Roll No', user.rollno || '-'],
            ['Role', user.role],
            ['User ID', user._id?.slice(-8)]
          ].map(([k, v]) => (
            <div key={k} className="soft-panel">
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700, marginBottom: '0.25rem' }}>{k}</p>
              <p style={{ fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stack-grid">
        <div className="glass" style={{ borderRadius: '1.5rem', padding: '1.5rem' }}>
          <div className="section-heading">
            <h4 className="title-font" style={{ fontSize: '1.3rem' }}>📊 Stats</h4>
            <span className="section-subtle">Updated from your activity</span>
          </div>
          {[
            { icon: '📚', val: myIssues.filter(i => !i.returned).length, label: 'Currently Borrowed' },
            { icon: '✅', val: myIssues.filter(i => i.returned).length, label: 'Returned' },
            { icon: '⏳', val: myRequests.length, label: 'Pending Requests' },
          ].map(s => (
            <div key={s.label} className="soft-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{s.icon} {s.label}</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchCatalog({ user }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const { showToast, ToastEl } = useToast();

  const search = async () => {
    if (!query.trim()) return;
    try {
      const res = await api.getBooks(query);
      setResults(res.data);
      setSearched(true);
    } catch {
      showToast('Search failed', true);
    }
  };

  const handleAction = async (action, book) => {
    if (action !== 'request') return;
    try {
      await api.makeRequest(book._id);
      showToast('Request submitted!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Request failed', true);
    }
  };

  const canRequest = user.role === 'Student' || user.role === 'Faculty';

  return (
    <div>
      {ToastEl}
      <div className="glass" style={{ borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem' }}>
        <div className="section-heading">
          <div>
            <h3 className="title-font" style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>Discover Books</h3>
            <p className="section-subtle">Search the catalog by title, author, or subject area.</p>
          </div>
        </div>
        <div className="search-bar">
          <input
            className="input-field"
            placeholder="Search by title, author, or subject..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            style={{ flex: 1, fontSize: '1rem', padding: '1rem 1.25rem' }}
          />
          <button onClick={search} className="btn-primary" style={{ padding: '1rem 1.5rem', fontSize: '1rem' }}>🔍</button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <span style={{ opacity: 0.6, fontSize: '0.8rem', alignSelf: 'center' }}>Quick:</span>
          {['Computer Science', 'Database', 'AI', 'Algorithms'].map(t => (
            <button key={t} onClick={() => { setQuery(t); setTimeout(search, 50); }} className="btn-ghost" style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {searched ? (
        results.length > 0 ? (
          <div className="card-grid">
            {results.map(b => (
              <BookCard key={b._id} book={b} actionType={canRequest ? 'request' : null} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="empty-panel">No books found for "{query}"</div>
        )
      ) : (
        <div className="empty-panel" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <p>Enter a search term to find books</p>
        </div>
      )}
    </div>
  );
}

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyBooks().then(r => setBooks(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty-panel">Loading...</div>;

  return (
    <div>
      <div className="section-heading">
        <div>
          <h3 className="title-font" style={{ fontSize: '1.35rem' }}>📘 Currently Borrowed</h3>
          <p className="section-subtle">{books.length} active item{books.length === 1 ? '' : 's'} in your account</p>
        </div>
      </div>
      {books.length === 0
        ? <div className="empty-panel">No books currently borrowed</div>
        : books.map(item => <IssuedBookCard key={item._id} item={item} showReturn={false} />)
      }
    </div>
  );
}

export { Welcome, Profile, SearchCatalog, MyBooks };
