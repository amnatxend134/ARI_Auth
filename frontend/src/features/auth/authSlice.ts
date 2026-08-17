import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './authTypes';
import { signupUser, signinUser, logoutUser } from './authThunks';



const STORAGE_KEY = 'ari_auth';

function loadPersisted(): Pick<AuthState, 'user' | 'accessToken' | 'refreshToken'> {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      sessionStorage.getItem(STORAGE_KEY);

    if (!raw) throw new Error('none');

    return JSON.parse(raw);
  } catch {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }
}

function persist(state: AuthState, rememberMe: boolean) {
  const data = JSON.stringify({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  });

  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, data);
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, data);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function clearPersisted() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

const initialState: AuthState = {
  ...loadPersisted(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
    tokenRefreshed(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      // Keep the token in whichever storage was originally chosen.
      const rememberMe = localStorage.getItem(STORAGE_KEY) !== null;
      persist(state, rememberMe);
    },
    loggedOut(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      clearPersisted();
    },
  },
  extraReducers: (builder) => {
    builder
      // ── signup ──
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Signup failed';
      })
      // ── signin ──
      .addCase(signinUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        persist(state, action.meta.arg.rememberMe);
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Sign in failed';
      })
      // ── logout ──
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = 'idle';
        clearPersisted();
      })
      .addCase(logoutUser.rejected, (state) => {
        // Server call failed but we still clear local session.
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = 'idle';
        clearPersisted();
      });
  },
});

export const { resetAuthStatus, tokenRefreshed, loggedOut } = authSlice.actions;
export default authSlice.reducer;