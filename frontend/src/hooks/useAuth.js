// src/hooks/useAuth.js
// Auth hook using React Query for server state
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/axios';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['currentUser'], data.user);
      navigate('/board');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await apiClient.post('/api/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['currentUser'], data.user);
      navigate('/board');
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (idToken) => {
      const { data } = await apiClient.post('/api/auth/google', { idToken });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['currentUser'], data.user);
      navigate('/board');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    navigate('/login');
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    googleLogin: googleLoginMutation.mutate,
    logout,
    currentUser: getCurrentUser(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
