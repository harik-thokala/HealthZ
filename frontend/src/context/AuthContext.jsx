// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

// Helper: check if a JWT is expired (using the `exp` claim)
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload || !payload.exp) {
      // If there is no exp, treat as NOT expired (you can change this)
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch (err) {
    console.error('isTokenExpired parse error', err);
    return true;
  }
}

export function AuthProvider({ children }) {
  // Initialize from localStorage
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return { token: null, user: null };

      const parsed = JSON.parse(raw);
      if (!parsed?.token || isTokenExpired(parsed.token)) {
        localStorage.removeItem('auth');
        return { token: null, user: null };
      }

      return {
        token: parsed.token,
        user: parsed.user || null,
      };
    } catch (err) {
      console.error('AuthContext init parse error', err);
      return { token: null, user: null };
    }
  });

  // Persist to localStorage whenever auth changes
  useEffect(() => {
    try {
      if (auth && auth.token) {
        localStorage.setItem('auth', JSON.stringify(auth));
      } else {
        localStorage.removeItem('auth');
      }
    } catch (err) {
      console.error('AuthContext persist error', err);
    }
  }, [auth]);

  // Called after successful login
  const login = useCallback(({ token, user }) => {
    if (!token) {
      throw new Error('login() requires a token');
    }
    setAuth({ token, user: user || null });
  }, []);

  // Clear state + localStorage
  const logout = useCallback(() => {
    setAuth({ token: null, user: null });
    try {
      localStorage.removeItem('auth');
    } catch (err) {
      console.error('AuthContext logout error', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
