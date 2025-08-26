import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';

describe('Toast Component', () => {
  test('renders with success variant', () => {
    render(<Toast message="Operation successful" type="success" />);
    
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    // Check for success styling
    const toastElement = screen.getByText('Operation successful').closest('div');
    expect(toastElement).toHaveClass('bg-green-50');
  });

  test('renders with error variant', () => {
    render(<Toast message="An error occurred" type="error" />);
    
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    // Check for error styling
    const toastElement = screen.getByText('An error occurred').closest('div');
    expect(toastElement).toHaveClass('bg-red-50');
  });

  test('renders with warning variant', () => {
    render(<Toast message="Warning message" type="warning" />);
    
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    // Check for warning styling
    const toastElement = screen.getByText('Warning message').closest('div');
    expect(toastElement).toHaveClass('bg-amber-50');
  });

  test('renders with info variant', () => {
    render(<Toast message="Information message" type="info" />);
    
    expect(screen.getByText('Information message')).toBeInTheDocument();
    // Check for info styling
    const toastElement = screen.getByText('Information message').closest('div');
    expect(toastElement).toHaveClass('bg-blue-50');
  });

  test('calls onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn();
    render(<Toast message="Test message" type="info" onClose={onCloseMock} />);
    
    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('automatically closes after duration', async () => {
    jest.useFakeTimers();
    const onCloseMock = jest.fn();
    
    render(<Toast message="Auto close" type="success" duration={1000} onClose={onCloseMock} />);
    
    expect(screen.getByText('Auto close')).toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    // Wait for state updates to propagate
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
    
    jest.useRealTimers();
  });
});
