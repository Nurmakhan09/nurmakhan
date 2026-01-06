import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const tokenStored = localStorage.getItem('lb_token');
  const userStored = localStorage.getItem('lb_user');
  const [token, setToken] = useState(tokenStored);
  const [user, setUser] = useState(userStored ? JSON.parse(userStored) : null);

  axios.defaults.baseURL = API;
  axios.interceptors.request.use(config => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const login = async ({ usernameOrEmail, password }) => {
    const res = await axios.post('/auth/login', { usernameOrEmail, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('lb_token', token);
    localStorage.setItem('lb_user', JSON.stringify(user));
    return user;
  };

  const register = async ({ username, email, password }) => {
    const res = await axios.post('/auth/register', { username, email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('lb_token', token);
    localStorage.setItem('lb_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('lb_token'); localStorage.removeItem('lb_user');
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);