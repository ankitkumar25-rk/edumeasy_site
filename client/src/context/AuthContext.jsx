import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [accessToken]);

  const silentRefresh = async () => {
    try {
      const response = await axiosInstance.get('/auth/refresh');
      if (response.data && response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (err) {
      // Ignore silent refresh failures on initial load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    silentRefresh();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      // Log or swallow logout network issues
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, setAccessToken, setUser }}>
      {!loading && children}
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
