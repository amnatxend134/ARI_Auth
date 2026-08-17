import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  PublicUser,
} from '../types/shared.js';


function signAccessToken(userId: string): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new AppError('Server misconfiguration', 500);
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId }, secret, options);
}

function signRefreshToken(userId: string): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new AppError('Server misconfiguration', 500);
  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId }, secret, options);
}

export async function registerUser(data: RegisterRequest): Promise<PublicUser> {
  const { name, username, email, password } = data;
  if (!name || !username || !email || !password) {
    throw new AppError('Name, username, email, and password are all required', 400);
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError('An account with this email already exists', 400);
  }

  const existingUsername = await User.findOne({
    username: username.toLowerCase(),
  });

  if (existingUsername) {
    throw new AppError('That username is already taken', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, username: username.toLowerCase(), email, password: hashedPassword });
  return { id: user.id, name: user.name, username: user.username, email: user.email };
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const { username, password } = data;
  const user = await User.findOne({ username: username.toLowerCase(), });
  if (!user) throw new AppError('Invalid username or password', 401);

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) throw new AppError('Invalid username or password', 401);

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  // store the refresh token hashed, not plaintext — if the DB ever leaks,
  // the raw refresh token still can't be reused directly
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, username: user.username, email: user.email },
  };
}

export async function refreshAccessToken(token: string): Promise<RefreshResponse> {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new AppError('Server misconfiguration', 500);

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
  if (typeof decoded === 'string' || !decoded.id) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  const matches = await bcrypt.compare(token, user.refreshToken);
  if (!matches) {
    throw new AppError('Invalid refresh token', 401);
  }

  const accessToken = signAccessToken(user.id);
  return { accessToken };
}

export async function logoutUser(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
}