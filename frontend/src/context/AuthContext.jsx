import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => ApiClient.getStoredUser());
  const [token, setToken] = useState(() => ApiClient.getStoredToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally verify stored token
    const verifyUser = async () => {
      if (token && !user) {
        try {
          const res = await ApiClient.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
          }
        } catch {
          ApiClient.clearAuthSession();
          setUser(null);
          setToken(null);
        }
      }
    };
    verifyUser();
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await ApiClient.login({ email, password });
      if (res && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await ApiClient.register(userData);
      if (res && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ApiClient.clearAuthSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
