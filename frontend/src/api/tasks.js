// src/api/tasks.js
import api from './axios.js';

export async function fetchTasks(params = {}) {
  const { data } = await api.get('/api/tasks', { params });
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post('/api/tasks', payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/api/tasks/${id}`, payload);
  return data;
}

export async function updateTaskStatus(id, status) {
  const { data } = await api.patch(`/api/tasks/${id}/status`, { status });
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/api/tasks/${id}`);
  return data;
}
