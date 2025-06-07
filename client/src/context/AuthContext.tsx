import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 检查用户是否已经登录
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post('/api/auth/login', { email, password });
      
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || '登录失败');
      } else {
        setError('登录过程中发生错误');
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post('/api/auth/register', { username, email, password });
      
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || '注册失败');
      } else {
        setError('注册过程中发生错误');
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      setLoading(true);
      await api.get('/api/auth/logout');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('退出登录失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  
  return context;
}; 