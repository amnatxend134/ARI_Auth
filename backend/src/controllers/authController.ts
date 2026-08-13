import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  PublicUser,
  ApiError,
} from '../types/shared.js';

export async function register(
  req: Request<{}, {}, RegisterRequest>,
  res: Response<{ message: string; user: PublicUser } | ApiError>,
  next: NextFunction
): Promise<void> {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginRequest>,
  res: Response<LoginResponse | ApiError>,
  next: NextFunction
): Promise<void> {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request<{}, {}, RefreshRequest>,
  res: Response<RefreshResponse | ApiError>,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'refreshToken is required' });
      return;
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response<{ message: string } | ApiError>,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    await authService.logoutUser(userId);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: Request,
  res: Response<PublicUser | ApiError>,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json(req.user as unknown as PublicUser);
  } catch (err) {
    next(err);
  }
}