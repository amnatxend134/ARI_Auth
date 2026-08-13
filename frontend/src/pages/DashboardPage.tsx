import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { logoutUser } from '../features/auth/authThunks';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user     = useAppSelector((s) => s.auth.user);
  const status   = useAppSelector((s) => s.auth.status);

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate('/signin');
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* Top nav bar */}
      <header className="bg-white border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
        <p className="text-sm font-bold tracking-widest text-zinc-900 uppercase">ARI</p>
        <button
          onClick={handleLogout}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-200
                     text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === 'loading' && (
            <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          )}
          Log out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold text-violet-600">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Hey, {user?.name ?? 'there'}!
          </h1>
          <p className="text-zinc-500 text-sm">
            You're logged in as{' '}
            <span className="text-zinc-700 font-medium">{user?.email}</span>.
          </p>

          <div className="mt-10 px-6 py-5 bg-white rounded-2xl border border-zinc-100 shadow-sm text-left">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
              Your profile
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Name</span>
                <span className="text-zinc-900 font-medium">{user?.name ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email</span>
                <span className="text-zinc-900 font-medium">{user?.email ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ID</span>
                <span className="text-zinc-400 font-mono text-xs">{user?.id ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
