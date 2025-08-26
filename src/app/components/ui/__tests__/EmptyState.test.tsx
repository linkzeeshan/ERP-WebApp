import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState, { NoDataEmptyState, NoResultsEmptyState, ErrorEmptyState } from '../EmptyState';

describe('EmptyState Component', () => {
  test('renders with required props', () => {
    render(
      <EmptyState
        title="No items found"
        description="Try adjusting your search criteria"
      />
    );
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });

  test('renders with custom icon', () => {
    const customIcon = <svg data-testid="custom-icon" />;
    
    render(
      <EmptyState
        title="Custom Icon"
        description="With custom icon"
        icon={customIcon}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('renders with action link', async () => {
    render(
      <EmptyState
        title="With Action Link"
        description="Click the button below"
        actionLabel="Go to Dashboard"
        actionLink="/dashboard"
      />
    );
    
    const actionButton = screen.getByText('Go to Dashboard');
    expect(actionButton).toBeInTheDocument();
    expect(actionButton.tagName).toBe('A');
    expect(actionButton).toHaveAttribute('href', '/dashboard');
  });

  test('renders with action button and calls onAction', async () => {
    const onActionMock = jest.fn();
    
    render(
      <EmptyState
        title="With Action Button"
        description="Click the button below"
        actionLabel="Refresh"
        onAction={onActionMock}
      />
    );
    
    const actionButton = screen.getByText('Refresh');
    expect(actionButton).toBeInTheDocument();
    expect(actionButton.tagName).toBe('BUTTON');
    
    await userEvent.click(actionButton);
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  test('NoDataEmptyState renders correctly', () => {
    render(<NoDataEmptyState actionLabel="Add Data" />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByText('There is no data to display at this time.')).toBeInTheDocument();
    expect(screen.getByText('Add Data')).toBeInTheDocument();
  });

  test('NoResultsEmptyState renders correctly and calls resetFilters', async () => {
    const resetFiltersMock = jest.fn();
    
    render(<NoResultsEmptyState resetFilters={resetFiltersMock} />);
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter to find what you're looking for.')).toBeInTheDocument();
    
    const resetButton = screen.getByText('Reset filters');
    await userEvent.click(resetButton);
    
    expect(resetFiltersMock).toHaveBeenCalledTimes(1);
  });

  test('ErrorEmptyState renders correctly and calls retry', async () => {
    const retryMock = jest.fn();
    
    render(<ErrorEmptyState retry={retryMock} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an error while loading the data. Please try again.')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Try again');
    await userEvent.click(retryButton);
    
    expect(retryMock).toHaveBeenCalledTimes(1);
  });
});
