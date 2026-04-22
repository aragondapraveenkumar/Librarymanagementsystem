import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const ToastEl = toast ? (
    <div
      className="toast"
      style={{ background: toast.isError ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#FF6B6B,#FF914D)' }}
      onClick={() => setToast(null)}
    >
      {toast.isError ? '⚠️' : '✅'} {toast.msg}
    </div>
  ) : null;

  return { showToast, ToastEl };
}
