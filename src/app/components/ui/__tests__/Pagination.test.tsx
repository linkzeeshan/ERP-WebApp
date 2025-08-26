import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  test('renders pagination with correct page numbers', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={() => {}}
      />
    );
    
    // Check if all page numbers are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check if current page has the correct styling
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-indigo-600');
    expect(currentPageButton).toHaveClass('text-white');
  });

  test('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    
    // Container should be empty
    expect(container.firstChild).toBeNull();
  });

  test('calls onPageChange with correct page number when page button is clicked', async () => {
    const onPageChangeMock = jest.fn();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Click on page 4
    await userEvent.click(screen.getByText('4'));
    
    // Check if onPageChange was called with correct page number
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange with previous page when Previous button is clicked', async () => {
    const onPageChangeMock = jest.fn();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Click on Previous button
    await userEvent.click(screen.getByText('Previous'));
    
    // Check if onPageChange was called with previous page
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange with next page when Next button is clicked', async () => {
    const onPageChangeMock = jest.fn();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Click on Next button
    await userEvent.click(screen.getByText('Next'));
    
    // Check if onPageChange was called with next page
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });

  test('disables Previous button when on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />
    );
    
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
    expect(previousButton).toHaveClass('text-gray-300');
    expect(previousButton).toHaveClass('cursor-not-allowed');
  });

  test('disables Next button when on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
      />
    );
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass('text-gray-300');
    expect(nextButton).toHaveClass('cursor-not-allowed');
  });

  test('renders ellipsis for large number of pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={() => {}}
      />
    );
    
    // Should show first page, ellipsis, pages around current page, ellipsis, and last page
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Pages far from current should not be displayed
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('9')).not.toBeInTheDocument();
  });
});
