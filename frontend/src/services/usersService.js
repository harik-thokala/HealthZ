// src/services/usersService.js
import { useApi } from '../hooks/useApi';

export default function usersServiceFactory() {
  const { request } = useApi();

  const listUsers = async () => request('/api/users', { method: 'GET' });

  const createUser = async (payload) => request('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const updateUser = async (id, payload) => request(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const deleteUser = async (id) => request(`/api/users/${id}`, { method: 'DELETE' });

  return { listUsers, createUser, updateUser, deleteUser };
}
