import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../ToastContext';

// Test component that uses the toast context
function TestComponent() {
  const { showToast } = useToast();
  
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>Show Success Toast</button>
      <button onClick={() => showToast('Error message', 'error')}>Show Error Toast</button>
      <button onClick={() => showToast('Warning message', 'warning')}>Show Warning Toast</button>
      <button onClick={() => showToast('Info message', 'info')}>Show Info Toast</button>
    </div>
  );
}

describe('ToastContext', () => {
  test('shows success toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Success Toast'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('bg-green-50');
  });

  test('shows error toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Error Toast'));
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    const toastElement = screen.getByText('Error message').closest('div');
    expect(toastElement).toHaveClass('bg-red-50');
  });

  test('shows warning toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Warning Toast'));
    
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    const toastElement = screen.getByText('Warning message').closest('div');
    expect(toastElement).toHaveClass('bg-amber-50');
  });

  test('shows info toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Info Toast'));
    
    expect(screen.getByText('Info message')).toBeInTheDocument();
    const toastElement = screen.getByText('Info message').closest('div');
    expect(toastElement).toHaveClass('bg-blue-50');
  });

  test('removes toast when close button is clicked', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Info Toast'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);
    
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  test('can show multiple toasts', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await userEvent.click(screen.getByText('Show Success Toast'));
    await userEvent.click(screen.getByText('Show Error Toast'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('throws error when used outside provider', () => {
    // Suppress console errors for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
    
    // Restore console.error
    console.error = originalError;
  });
});
