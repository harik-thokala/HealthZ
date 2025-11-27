import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const request = async (path, options = {}) => {
    const headers = options.headers || {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`http://localhost:5000${path}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  return { request };
}
