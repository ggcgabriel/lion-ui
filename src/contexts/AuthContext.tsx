import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, tokenHelper } from '@/services/api';
import type { User } from '@/types';
import { AuthContext, type AuthContextType } from './authContextDef';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(tokenHelper.get());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = tokenHelper.get();
      if (savedToken) {
        try {
          const userData = await authApi.me();
          setUser(userData);
          setToken(savedToken);
        } catch {
          tokenHelper.remove();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const { accessToken } = await authApi.login({ email, password });
      tokenHelper.set(accessToken);
      setToken(accessToken);

      const userData = await authApi.me();
      setUser(userData);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.';

      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          setError(
            Array.isArray(axiosErr.response.data.message)
              ? axiosErr.response.data.message.join(', ')
              : axiosErr.response.data.message
          );
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    tokenHelper.remove();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
