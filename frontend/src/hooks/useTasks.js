// src/hooks/useTasks.js
// Tasks hook with React Query for CRUD operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import { useToast } from '../contexts/ToastContext';

export function useTasks(filters = {}) {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch tasks with optional filters
  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const { data } = await apiClient.get(`/api/tasks?${params}`);
      return data;
    },
  });

  // Create task
  const createMutation = useMutation({
    mutationFn: async (taskData) => {
      const { data } = await apiClient.post('/api/tasks', taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  // Update task
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await apiClient.put(`/api/tasks/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  // Update task status (optimistic)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await apiClient.patch(`/api/tasks/${id}/status`, { status });
      return data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', filters]);
      
      // Optimistically update
      queryClient.setQueryData(['tasks', filters], (old) =>
        old?.map((task) => (task._id === id ? { ...task, status } : task))
      );
      
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks', filters], context.previousTasks);
      toast.error('Failed to update task status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    deleteTask: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
