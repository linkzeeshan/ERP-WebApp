import { render, screen } from '@testing-library/react';
import Badge, { StatusBadge } from '../Badge';

describe('Badge Component', () => {
  test('renders with default props', () => {
    render(<Badge label="Default Badge" />);
    
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });

  test('renders with success variant', () => {
    render(<Badge label="Success" variant="success" />);
    
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  test('renders with warning variant', () => {
    render(<Badge label="Warning" variant="warning" />);
    
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-amber-100');
    expect(badge).toHaveClass('text-amber-800');
  });

  test('renders with danger variant', () => {
    render(<Badge label="Danger" variant="danger" />);
    
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  test('renders with info variant', () => {
    render(<Badge label="Info" variant="info" />);
    
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  test('renders with small size', () => {
    render(<Badge label="Small Badge" size="small" />);
    
    const badge = screen.getByText('Small Badge');
    expect(badge).toHaveClass('text-xs');
  });

  test('renders with outline style', () => {
    render(<Badge label="Outline Badge" outline />);
    
    const badge = screen.getByText('Outline Badge');
    expect(badge).toHaveClass('bg-white');
    expect(badge).toHaveClass('border');
    expect(badge).toHaveClass('border-gray-300');
  });

  test('renders with outline and variant', () => {
    render(<Badge label="Success Outline" variant="success" outline />);
    
    const badge = screen.getByText('Success Outline');
    expect(badge).toHaveClass('bg-white');
    expect(badge).toHaveClass('text-green-700');
    expect(badge).toHaveClass('border-green-500');
  });
});

describe('StatusBadge Component', () => {
  test('renders success variant for positive statuses', () => {
    const statuses = ['Active', 'Completed', 'Approved', 'Success', 'Online', 'Operational'];
    
    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />);
      
      const badge = screen.getByText(status);
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
      
      unmount();
    });
  });

  test('renders warning variant for pending statuses', () => {
    const statuses = ['Pending', 'In Progress', 'Waiting', 'Warning', 'Partial'];
    
    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />);
      
      const badge = screen.getByText(status);
      expect(badge).toHaveClass('bg-amber-100');
      expect(badge).toHaveClass('text-amber-800');
      
      unmount();
    });
  });

  test('renders danger variant for negative statuses', () => {
    const statuses = ['Inactive', 'Failed', 'Rejected', 'Error', 'Offline', 'Critical'];
    
    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />);
      
      const badge = screen.getByText(status);
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
      
      unmount();
    });
  });

  test('renders default variant for unknown statuses', () => {
    render(<StatusBadge status="Unknown Status" />);
    
    const badge = screen.getByText('Unknown Status');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });
});
