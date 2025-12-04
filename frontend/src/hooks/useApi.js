// src/hooks/useApi.js
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const request = useCallback(async (path, opts = {}) => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const headers = { ...(opts.headers || {}) };

    // default JSON content-type unless body is FormData or already set
    if (!(opts.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(base + path, { ...opts, headers });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    if (!res.ok) {
      const err = new Error(data?.error || 'Request failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }, [token]);

  return { request };
}
