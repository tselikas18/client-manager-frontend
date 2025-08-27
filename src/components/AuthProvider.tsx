import React, { useEffect, useState } from 'react';
import { AuthContext, api, type User } from '../context/auth.ts';
import axios from "axios";

const mapToUser = (raw: any): User => ({
  id: raw?.id ?? raw?._id ?? '',
  name: raw?.name ?? raw?.username ?? '',
  email: raw?.email ?? '',
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    (async () => {
      try {
        const res = await api.get<User>('/auth/me');
        if (mounted) setUser(mapToUser(res.data));
      } catch (err: any) {
        console.error('fetchMe error:', err?.response || err);
        if (err?.response?.status === 401) {
          localStorage.removeItem('authToken');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(mapToUser(user));

      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.error || error.message || 'Login failed' };
      }
      if (error instanceof Error) return { success: false, error: error.message };
      return { success: false, error: String(error) };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('authToken');

      delete api.defaults.headers.common['Authorization'];

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { username: name, email, password });
      return await login(email, password);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { success: false, error: error.response?.data?.error || error.message || 'Registration failed' };
      }
      if (error instanceof Error) return { success: false, error: error.message };
      return { success: false, error: String(error) };
    }
  };


  return (
      <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthProvider;