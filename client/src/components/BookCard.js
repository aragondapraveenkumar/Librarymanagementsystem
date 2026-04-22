import React from 'react';

export default function BookCard({ book, actionType, onAction }) {
  const avail = book.availableCopies > 0;

  return (
    <div className="book-card book-card-shell">
      <div className="book-card-media">
        {book.imageBase64 ? (
          <img
            src={book.imageBase64}
            alt={book.title}
            style={{
              width: 68,
              height: 68,
              objectFit: 'cover',
              borderRadius: '0.9rem',
              margin: '0 auto 0.8rem',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          />
        ) : (
          <div style={{ fontSize: '3.35rem', marginBottom: '0.8rem' }}>📘</div>
        )}
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.96rem',
            lineHeight: 1.35,
            color: '#FFF9E8',
            marginBottom: '0.35rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {book.title}
        </div>
        <div style={{ fontSize: '0.74rem', opacity: 0.78, fontStyle: 'italic', marginBottom: '0.7rem' }}>
          by {book.author}
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2rem',
            padding: '0.25rem 0.7rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'inline-block',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          {book.availableCopies}/{book.totalCopies} copies
        </div>
      </div>

      <div className="book-card-body">
        <div>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.58, marginBottom: '0.35rem' }}>
            {book.subject || 'General'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            ISBN: {book.isbn}
          </div>
        </div>

        <div>
          {actionType === 'manage' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onAction('edit', book)} className="btn-ghost" style={{ flex: 1, padding: '0.55rem', fontSize: '0.75rem', textAlign: 'center' }}>
                EDIT
              </button>
              <button
                onClick={() => onAction('delete', book)}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  fontSize: '0.75rem',
                  background: 'rgba(239,68,68,0.25)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(248,113,113,0.24)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                DELETE
              </button>
            </div>
          )}
          {actionType === 'issue' && (
            <button onClick={() => onAction('select-issue', book)} className="btn-ghost" style={{ width: '100%', padding: '0.6rem', fontSize: '0.76rem', textAlign: 'center', opacity: avail ? 1 : 0.45 }} disabled={!avail}>
              SELECT TO ISSUE
            </button>
          )}
          {actionType === 'request' && (
            <button onClick={() => onAction('request', book)} className="btn-ghost" style={{ width: '100%', padding: '0.6rem', fontSize: '0.76rem', textAlign: 'center', opacity: avail ? 1 : 0.45 }} disabled={!avail}>
              {avail ? 'REQUEST BOOK' : 'OUT OF STOCK'}
            </button>
          )}
          {!actionType && (
            <span
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.45rem',
                fontSize: '0.75rem',
                borderRadius: '2rem',
                background: avail ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                color: avail ? '#86efac' : '#fca5a5',
                border: `1px solid ${avail ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                fontWeight: 700
              }}
            >
              {avail ? 'AVAILABLE' : 'OUT OF STOCK'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
