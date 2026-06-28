import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios.js';
import { API_ENDPOINTS } from '../api/endpoints.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          if (originalRequest.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
            setAccessToken(null);
            setUser(null);
            window.location.href = '/';
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          try {
            const refreshResponse = await axiosInstance.get(API_ENDPOINTS.AUTH.REFRESH);
            if (refreshResponse.data && refreshResponse.data.accessToken) {
              const newToken = refreshResponse.data.accessToken;
              setAccessToken(newToken);
              setUser(refreshResponse.data.user);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            setAccessToken(null);
            setUser(null);
            window.location.href = '/';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  const silentRefresh = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.REFRESH);
      if (response.data && response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (err) {
      // Swallow error during initial silent refresh attempt
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    silentRefresh();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.data && response.data.accessToken) {
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      // Swallow logout network errors
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
