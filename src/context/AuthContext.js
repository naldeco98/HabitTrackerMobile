import React, { createContext, useState, useEffect } from 'react';
import { getActiveSession, authenticateUser, registerUser, logoutUser } from '../services/storageService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await getActiveSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (e) {
        console.error('Error al verificar sesión inicial:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username, password) => {
    const res = await authenticateUser(username, password);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (username, password) => {
    const res = await registerUser(username, password);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
