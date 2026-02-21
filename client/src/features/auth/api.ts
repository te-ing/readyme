import { api } from '@/lib/api';

import type { AuthResponse, LoginRequest, RegisterRequest, AuthUser } from 'shared';

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),

  getMe: () => api.get<AuthUser>('/auth/me'),
};
