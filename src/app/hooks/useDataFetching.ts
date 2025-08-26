import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface UseDataFetchingOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
}

export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  options: UseDataFetchingOptions<T> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (options.onError) {
        options.onError(error);
      }
      showToast(
        options.errorMessage || 'Failed to fetch data. Please try again.',
        'error'
      );
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options, showToast]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    setData
  };
}

export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | undefined>(undefined);
  const { showToast } = useToast();

  const mutate = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await mutationFn(params);
        setData(result);
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        if (options.successMessage) {
          showToast(options.successMessage, 'success');
        }
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        if (options.onError) {
          options.onError(error);
        }
        showToast(
          options.errorMessage || 'Operation failed. Please try again.',
          'error'
        );
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, options, showToast]
  );

  return {
    mutate,
    isLoading,
    error,
    data,
    reset: () => {
      setData(undefined);
      setError(null);
    }
  };
}
