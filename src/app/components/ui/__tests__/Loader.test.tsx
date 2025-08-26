import { render, screen } from '@testing-library/react';
import Loader, { ButtonLoader, TableLoader, PageLoader } from '../Loader';

describe('Loader Component', () => {
  test('renders with default props', () => {
    render(<Loader />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveClass('w-8 h-8');
    expect(loaderElement).toHaveClass('text-indigo-600');
  });

  test('renders with small size', () => {
    render(<Loader size="small" />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toHaveClass('w-5 h-5');
  });

  test('renders with large size', () => {
    render(<Loader size="large" />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toHaveClass('w-12 h-12');
  });

  test('renders with secondary color', () => {
    render(<Loader color="secondary" />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toHaveClass('text-gray-600');
  });

  test('renders with white color', () => {
    render(<Loader color="white" />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toHaveClass('text-white');
  });

  test('renders with text', () => {
    render(<Loader text="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('renders as fullscreen overlay', () => {
    render(<Loader fullScreen />);
    
    const overlayElement = screen.getByRole('img', { hidden: true }).closest('div')?.parentElement;
    expect(overlayElement).toHaveClass('fixed inset-0');
  });

  test('ButtonLoader renders correctly', () => {
    render(<ButtonLoader />);
    
    const loaderElement = screen.getByRole('img', { hidden: true });
    expect(loaderElement).toHaveClass('w-5 h-5');
    expect(loaderElement).toHaveClass('text-white');
  });

  test('TableLoader renders correctly', () => {
    render(<TableLoader />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    const containerElement = screen.getByText('Loading data...').closest('div')?.parentElement;
    expect(containerElement).toHaveClass('w-full py-12');
  });

  test('PageLoader renders correctly', () => {
    render(<PageLoader />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const containerElement = screen.getByText('Loading...').closest('div')?.parentElement;
    expect(containerElement).toHaveClass('w-full h-64');
  });
});
