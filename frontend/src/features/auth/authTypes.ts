export interface PublicUser {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface RegisterResponse {
  message: string;
  user: PublicUser;
}