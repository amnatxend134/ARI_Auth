import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { signinUser } from '../features/auth/authThunks';
import { resetAuthStatus } from '../features/auth/authSlice';
import signinBg from '../assets/signin_bg_pic.jpg';

function PersonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SigninPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0 && status !== 'loading';

  useEffect(() => { dispatch(resetAuthStatus()); }, [dispatch]);
  useEffect(() => { if (status === 'succeeded') navigate('/dashboard'); }, [status, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    dispatch(signinUser({ username: username.trim(), password, rememberMe, }));
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '58%', flexShrink: 0 }}>
        <img src={signinBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem' }}>
          <p style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', fontFamily: 'system-ui, sans-serif' }}>
            Welcome Back!
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: '1.75rem', padding: '2.5rem 2.25rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 1.75rem 0', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.03em' }}>
            Log in
          </h1>

          {status === 'failed' && error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <span style={iconInInputStyle}><PersonIcon /></span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{ ...inputStyle, paddingLeft: '2.5rem' }}
             
              onFocus={focusInput}
              onBlur={blurInput}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <span style={iconInInputStyle}><LockIcon /></span>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
             
              onFocus={focusInput}
              onBlur={blurInput}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} style={eyeBtnStyle} aria-label={showPw ? 'Hide' : 'Show'}>
                {showPw ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b7280', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember Me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={!canSubmit} style={{ ...submitBtnStyle, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' && (
                <svg style={{ animation: 'spin 0.8s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {status === 'loading' ? 'Logging in…' : 'Log in'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.1rem 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Or</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            <Link to="/signup" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '999px', background: '#f3f4f6', color: '#374151', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Sign up
            </Link>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function focusInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#111';
}
function blurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'transparent';
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.7rem 0.9rem', borderRadius: '999px', border: '1.5px solid transparent',
  background: '#f3f4f6', fontSize: '0.875rem', color: '#111', outline: 'none', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box',
};
const iconInInputStyle: React.CSSProperties = {
  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex',
};
const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none',
  cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center',
};
const submitBtnStyle: React.CSSProperties = {
  width: '100%', padding: '0.8rem', borderRadius: '999px', border: 'none', background: '#111', color: '#fff',
  fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'system-ui, sans-serif',
};