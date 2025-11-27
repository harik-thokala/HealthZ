import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { token: null, user: null };
  });

  const login = (data) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
