// src/hooks/useEmployees.js
// Employees hook with React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';

export function useEmployees() {
  const queryClient = useQueryClient();

  // Fetch employees
  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/employees');
      return data;
    },
  });

  // Create employee (admin only)
  const createMutation = useMutation({
    mutationFn: async (employeeData) => {
      const { data } = await apiClient.post('/api/employees', employeeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Update employee (admin only)
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await apiClient.put(`/api/employees/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Delete employee (admin only)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/employees/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
    createEmployee: createMutation.mutate,
    updateEmployee: updateMutation.mutate,
    deleteEmployee: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
