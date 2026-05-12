import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  is_vip: boolean;
  is_admin: boolean;
  reputation: number;
  achievements: Achievement[];
}

interface Achievement {
  code: string;
  name: string;
  icon: string;
  points: number;
  earned_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const sid = localStorage.getItem('session_id');
    if (!sid) { setLoading(false); return; }
    const data = await authApi.me();
    if (data.id) setUser(data);
    else localStorage.removeItem('session_id');
    setLoading(false);
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (loginVal: string, password: string) => {
    const data = await authApi.login({ login: loginVal, password });
    if (data.error) return { error: data.error };
    localStorage.setItem('session_id', data.session_id);
    await loadUser();
    return {};
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authApi.register({ username, email, password });
    if (data.error) return { error: data.error };
    localStorage.setItem('session_id', data.session_id);
    await loadUser();
    return {};
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('session_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
