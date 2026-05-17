import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/client';
import type { AuthResponse } from '../types';

interface AuthState {
  username: string | null;
  roles: string[];
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (body: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function loadStored(): Pick<AuthState, 'username' | 'roles' | 'token'> {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const roles = JSON.parse(localStorage.getItem('roles') ?? '[]') as string[];
  return { token, username, roles };
}

function persistAuth(data: AuthResponse) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('roles', JSON.stringify(data.roles));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadStored();
  const [username, setUsername] = useState<string | null>(stored.username);
  const [roles, setRoles] = useState<string[]>(stored.roles);
  const [token, setToken] = useState<string | null>(stored.token);

  const applyAuth = useCallback((data: AuthResponse) => {
    persistAuth(data);
    setToken(data.token);
    setUsername(data.username);
    setRoles(data.roles);
  }, []);

  const login = useCallback(
    async (u: string, p: string) => {
      applyAuth(await authApi.login(u, p));
    },
    [applyAuth]
  );

  const register = useCallback(
    async (body: Record<string, unknown>) => {
      applyAuth(await authApi.register(body));
    },
    [applyAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    setToken(null);
    setUsername(null);
    setRoles([]);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      username,
      roles,
      token,
      isAuthenticated: !!token,
      isAdmin: roles.includes('ADMIN'),
      login,
      register,
      logout,
    }),
    [username, roles, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
