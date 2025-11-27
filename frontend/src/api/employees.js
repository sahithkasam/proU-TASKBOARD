// src/api/employees.js
import api from './axios.js';

export async function listEmployees() {
  const { data } = await api.get('/api/employees');
  return data;
}

export async function createEmployee(payload) {
  const { data } = await api.post('/api/employees', payload);
  return data;
}

export async function updateEmployee(id, payload) {
  const { data } = await api.put(`/api/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await api.delete(`/api/employees/${id}`);
  return data;
}
