import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { signupUser } from '../features/auth/authThunks';
import { resetAuthStatus } from '../features/auth/authSlice';
import signupBg from '../assets/signup_bg_pic.jpg';

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
function CheckIcon({ pass }: { pass: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={pass ? '#22c55e' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {pass ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

function evalRules(pw: string) {
  return {
    length: pw.length >= 8,
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
    uppercase: /[A-Z]/.test(pw),
  };
}
function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const rules = evalRules(password);
  const allRulesPass = Object.values(rules).every(Boolean);
  const passwordsMatch = password === confirm;
  const canSubmit =
    name.trim().length > 0 && username.trim().length > 0 && isEmailValid(email) && allRulesPass && passwordsMatch && status !== 'loading';

  useEffect(() => { dispatch(resetAuthStatus()); }, [dispatch]);
  useEffect(() => { if (status === 'succeeded') navigate('/signin'); }, [status, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    dispatch(signupUser({ name: name.trim(), username: username.trim(), email: email.trim(), password }));
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '58%', flexShrink: 0 }}>
        <img src={signupBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem' }}>
          <p style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em', fontFamily: 'system-ui, sans-serif' }}>
            Welcome!
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ background: '#fff', borderRadius: '1.75rem', padding: '2.5rem 2.25rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 1.75rem 0', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.03em' }}>
            Sign up
          </h1>

          {status === 'failed' && error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#dc2626', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div>
            <label style={labelStyle}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    style={{ ...inputStyle, paddingRight: '2.25rem' }}
                 
                  onFocus={focusInput}
                  onBlur={blurInput}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} style={eyeBtnStyle} aria-label={showPw ? 'Hide' : 'Show'}>
                    {showPw ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); if (!confirmTouched) setConfirmTouched(true); }}
                    placeholder="••••••••••"
                    style={{
                      ...inputStyle,
                      paddingRight: '2.25rem',
                      borderColor: confirmTouched && !passwordsMatch ? '#fca5a5' : 'transparent',
                      borderWidth: '1.5px',
                      borderStyle: 'solid',
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} style={eyeBtnStyle} aria-label={showConfirm ? 'Hide' : 'Show'}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {confirmTouched && !passwordsMatch && (
                  <p style={{ color: '#dc2626', fontSize: '0.7rem', margin: '0.25rem 0 0' }}>Passwords do not match</p>
                )}
              </div>
            </div>

            {password.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {([
                  ['length', 'At least 8 characters'],
                  ['number', 'At least 1 number'],
                  ['special', 'At least 1 special character'],
                  ['uppercase', 'At least 1 uppercase letter'],
                ] as const).map(([key, label]) => (
                  <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckIcon pass={rules[key]} />
                    <span style={{ fontSize: '0.75rem', color: rules[key] ? '#16a34a' : '#9ca3af' }}>{label}</span>
                  </li>
                ))}
              </ul>
            )}

            <button type="submit" disabled={!canSubmit} style={{ ...submitBtnStyle, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              {status === 'loading' && (
                <svg style={{ animation: 'spin 0.8s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {status === 'loading' ? 'Creating account…' : 'Create Account'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.1rem 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Or</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            <Link to="/signin" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '999px', background: '#f3f4f6', color: '#374151', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Log in
            </Link>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem', fontFamily: 'system-ui, sans-serif',
};
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
const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none',
  cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center',
};
const submitBtnStyle: React.CSSProperties = {
  width: '100%', padding: '0.8rem', borderRadius: '999px', border: 'none', background: '#111', color: '#fff',
  fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'system-ui, sans-serif',
};