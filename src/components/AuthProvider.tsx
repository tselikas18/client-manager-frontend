import React, { useEffect, useState } from 'react';
import { AuthContext, api, type User } from '../context/auth.ts';
import axios from "axios";

const tokenKey = 'token';

const mapToUser = (raw: any): User => ({
  id: raw?.id ?? raw?._id ?? '',
  name: raw?.name ?? raw?.username ?? '',
  email: raw?.email ?? '',
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(tokenKey);
  });

  useEffect(() => {
    let mounted = true;
    if (token === null) {
      setLoading(false);
      return;
    }

    api.defaults.withCredentials = true; // ensure cookies if not set globally
    (async () => {
      try {
        const res = await api.get<User>('/users/me');
        if (mounted) setUser(res.data);
      } catch (err: any) {
        console.error('fetchMe', err?.response || err);
        if (err?.response?.status === 401) logout();
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(mapToUser(res.data));
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUser(null);
      } else {
        console.error('fetchMe error', err?.response || err);
      }
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await api.post('/auth/login', { email, password });
      await fetchMe();
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.error || error.message || 'Login failed' };
      }
      if (error instanceof Error) return { success: false, error: error.message };
      return { success: false, error: String(error) };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { username: name, email, password });
      return await login(email, password);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.detail || error.message || 'Login failed' };
      }
      if (error instanceof Error) return { success: false, error: error.message };  return { success: false, error: String(error) };
    }
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthProvider;