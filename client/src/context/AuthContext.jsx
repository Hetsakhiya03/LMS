import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to authenticate stored token:', err.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.data);
        setIsLoading(false);
        return res;
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.data);
        setIsLoading(false);
        return res;
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success) {
        setUser(res.data);
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
