import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/authApi';
import type { LoginResponse, RegisterResponse } from './authTypes';

interface SignupArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface SigninArgs {
  username: string;
  password: string;
  rememberMe: boolean;
}

function extractError(err: any): string {
  return err?.response?.data?.error || 'Something went wrong. Please try again.';
}

export const signupUser = createAsyncThunk<RegisterResponse, SignupArgs, { rejectValue: string }>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<RegisterResponse>('/auth/register', payload);
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const signinUser = createAsyncThunk<LoginResponse, SigninArgs, { rejectValue: string }>(
  'auth/signin',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { username: payload.username, password: payload.password,});
      return data;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Even if the server call fails, we still clear local state in the reducer.
      return rejectWithValue(extractError(err));
    }
  }
);