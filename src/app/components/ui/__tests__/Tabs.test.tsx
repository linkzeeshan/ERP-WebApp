import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from '../Tabs';

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content for Tab 3</div> }
  ];

  test('renders with default props and first tab active', () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Check if all tab labels are rendered
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    
    // Check if first tab content is visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    
    // Check if other tab contents are not visible
    expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
  });

  test('renders with specified default tab active', () => {
    render(<Tabs tabs={mockTabs} defaultTabId="tab2" />);
    
    // Check if second tab content is visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    
    // Check if other tab contents are not visible
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
  });

  test('changes active tab when clicked', async () => {
    render(<Tabs tabs={mockTabs} />);
    
    // Initially first tab content is visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    
    // Click on second tab
    await userEvent.click(screen.getByText('Tab 2'));
    
    // Now second tab content should be visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    
    // And first tab content should not be visible
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
  });

  test('calls onChange when tab is clicked', async () => {
    const onChangeMock = jest.fn();
    render(<Tabs tabs={mockTabs} onChange={onChangeMock} />);
    
    // Click on second tab
    await userEvent.click(screen.getByText('Tab 2'));
    
    // Check if onChange was called with correct tab id
    expect(onChangeMock).toHaveBeenCalledWith('tab2');
  });

  test('renders disabled tab correctly', async () => {
    const tabsWithDisabled = [
      ...mockTabs.slice(0, 2),
      { ...mockTabs[2], disabled: true }
    ];
    
    render(<Tabs tabs={tabsWithDisabled} />);
    
    const disabledTab = screen.getByText('Tab 3');
    expect(disabledTab).toHaveClass('text-gray-400');
    expect(disabledTab).toHaveClass('cursor-not-allowed');
    
    // Click on disabled tab
    await userEvent.click(disabledTab);
    
    // Content should not change to disabled tab
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
  });

  test('renders with pills variant', () => {
    render(<Tabs tabs={mockTabs} variant="pills" />);
    
    const tabList = screen.getByText('Tab 1').closest('div')?.parentElement;
    expect(tabList).toHaveClass('flex space-x-1');
    
    const activeTab = screen.getByText('Tab 1');
    expect(activeTab).toHaveClass('px-3 py-2 rounded-md');
    expect(activeTab).toHaveClass('bg-indigo-100');
    expect(activeTab).toHaveClass('text-indigo-700');
  });

  test('renders with underline variant', () => {
    render(<Tabs tabs={mockTabs} variant="underline" />);
    
    const tabList = screen.getByText('Tab 1').closest('div')?.parentElement;
    expect(tabList).toHaveClass('border-b border-gray-200');
    
    const activeTab = screen.getByText('Tab 1');
    expect(activeTab).toHaveClass('py-4 px-1 border-b-2');
    expect(activeTab).toHaveClass('border-indigo-500');
    expect(activeTab).toHaveClass('text-indigo-600');
  });
});
