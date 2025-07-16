import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useApi = <T>(url: string, options?: { immediate?: boolean }) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.get(url);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || 'An error occurred';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [url]);

  useEffect(() => {
    if (options?.immediate !== false) {
      execute();
    }
  }, [url, execute, options?.immediate]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
};