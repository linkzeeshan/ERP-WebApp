import { renderHook, act, waitFor } from '@testing-library/react';
import { useDataFetching, useMutation } from '../useDataFetching';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock the toast context
jest.mock('../../contexts/ToastContext', () => {
  const originalModule = jest.requireActual('../../contexts/ToastContext');
  return {
    ...originalModule,
    useToast: () => ({
      showToast: jest.fn(),
    }),
  };
});

describe('useDataFetching hook', () => {
  test('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test Item' };
    const mockFetchFn = jest.fn().mockResolvedValue(mockData);
    const onSuccessMock = jest.fn();
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useDataFetching(mockFetchFn, { onSuccess: onSuccessMock }),
      { wrapper }
    );
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Data should be loaded
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(onSuccessMock).toHaveBeenCalledWith(mockData);
  });

  test('handles fetch error', async () => {
    const mockError = new Error('Failed to fetch');
    const mockFetchFn = jest.fn().mockRejectedValue(mockError);
    const onErrorMock = jest.fn();
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useDataFetching(mockFetchFn, { onError: onErrorMock }),
      { wrapper }
    );
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have error
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(onErrorMock).toHaveBeenCalledWith(mockError);
  });

  test('uses initial data when provided', async () => {
    const initialData = { id: 1, name: 'Initial Item' };
    const mockData = { id: 2, name: 'Fetched Item' };
    const mockFetchFn = jest.fn().mockResolvedValue(mockData);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useDataFetching(mockFetchFn, { initialData }),
      { wrapper }
    );
    
    // Should have initial data immediately
    expect(result.current.data).toEqual(initialData);
    
    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Data should be updated
    expect(result.current.data).toEqual(mockData);
  });

  test('refresh function fetches data again', async () => {
    const mockData1 = { id: 1, name: 'First Item' };
    const mockData2 = { id: 2, name: 'Second Item' };
    const mockFetchFn = jest.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useDataFetching(mockFetchFn),
      { wrapper }
    );
    
    // Wait for first fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockData1);
    
    // Call refresh
    act(() => {
      result.current.refresh();
    });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Wait for second fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Data should be updated
    expect(result.current.data).toEqual(mockData2);
    expect(mockFetchFn).toHaveBeenCalledTimes(2);
  });
});

describe('useMutation hook', () => {
  test('performs mutation successfully', async () => {
    const mockData = { id: 1, name: 'Created Item' };
    const mockMutationFn = jest.fn().mockResolvedValue(mockData);
    const onSuccessMock = jest.fn();
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useMutation(mockMutationFn, { 
        onSuccess: onSuccessMock,
        successMessage: 'Item created successfully'
      }),
      { wrapper }
    );
    
    // Initially not loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    
    // Perform mutation
    const params = { name: 'New Item' };
    act(() => {
      result.current.mutate(params);
    });
    
    // Should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have result
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(onSuccessMock).toHaveBeenCalledWith(mockData);
    expect(mockMutationFn).toHaveBeenCalledWith(params);
  });

  test('handles mutation error', async () => {
    const mockError = new Error('Mutation failed');
    const mockMutationFn = jest.fn().mockRejectedValue(mockError);
    const onErrorMock = jest.fn();
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useMutation(mockMutationFn, { 
        onError: onErrorMock,
        errorMessage: 'Failed to create item'
      }),
      { wrapper }
    );
    
    // Perform mutation
    act(() => {
      result.current.mutate({ name: 'New Item' });
    });
    
    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have error
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(onErrorMock).toHaveBeenCalledWith(mockError);
  });

  test('reset function clears data and error', async () => {
    const mockData = { id: 1, name: 'Created Item' };
    const mockMutationFn = jest.fn().mockResolvedValue(mockData);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    
    const { result } = renderHook(
      () => useMutation(mockMutationFn),
      { wrapper }
    );
    
    // Perform mutation
    act(() => {
      result.current.mutate({ name: 'New Item' });
    });
    
    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Should have result
    expect(result.current.data).toEqual(mockData);
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    // Data and error should be cleared
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
