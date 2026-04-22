import React from 'react';

const DAILY_FINE = 10;

export default function IssuedBookCard({ item, showReturn, onReturn }) {
  const book = item.bookId;
  const issueDate = new Date(item.issueDate);
  const dueDate = new Date(item.dueDate);
  const today = new Date();
  const isOverdue = !item.returned && dueDate < today;
  const daysRemaining = Math.ceil((dueDate - today) / 86400000);
  let fine = item.fine || 0;

  if (showReturn && !item.returned && isOverdue) {
    fine = Math.ceil((today - dueDate) / 86400000) * DAILY_FINE;
  }

  return (
    <div className="glass issued-card card-hover">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h4 style={{ fontWeight: 700, fontSize: '1.12rem', marginBottom: '0.3rem' }}>{book?.title || '-'}</h4>
          <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.64)' }}>Author: {book?.author || '-'}</p>
          <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.64)', marginTop: '0.25rem' }}>
            Borrowed by: <strong style={{ color: '#fff' }}>{item.username}</strong>
          </p>
        </div>
        <div
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: `1px solid ${isOverdue ? 'rgba(248,113,113,0.38)' : 'rgba(74,222,128,0.32)'}`,
            color: isOverdue ? '#fca5a5' : '#86efac',
            background: isOverdue ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)'
          }}
        >
          {isOverdue ? `OVERDUE ${Math.abs(daysRemaining)}d` : `${daysRemaining}d left`}
        </div>
      </div>

      <div className="issued-meta-grid">
        <div className="soft-panel" style={{ padding: '0.95rem' }}>
          <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700, marginBottom: '0.25rem' }}>Issued</p>
          <p style={{ fontWeight: 600 }}>{issueDate.toLocaleDateString()}</p>
        </div>
        <div className="soft-panel" style={{ padding: '0.95rem' }}>
          <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700, marginBottom: '0.25rem' }}>Due Date</p>
          <p style={{ fontWeight: 600 }}>{dueDate.toLocaleDateString()}</p>
        </div>
        <div className="soft-panel" style={{ padding: '0.95rem' }}>
          <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6, fontWeight: 700, marginBottom: '0.25rem' }}>Fine</p>
          <p style={{ fontWeight: 600, color: fine > 0 ? '#fca5a5' : '#86efac' }}>{fine > 0 ? `₹${fine}` : '-'}</p>
          {isOverdue && <p style={{ fontSize: '0.65rem', color: '#fca5a5' }}>₹{DAILY_FINE}/day</p>}
        </div>
      </div>

      {showReturn && !item.returned && (
        <button onClick={() => onReturn(item._id)} className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
          RETURN BOOK
        </button>
      )}
    </div>
  );
}
