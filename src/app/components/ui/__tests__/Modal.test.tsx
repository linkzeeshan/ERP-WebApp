import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal, { ConfirmationModal } from '../Modal';

describe('Modal Component', () => {
  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn();
    
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Small Modal" size="small">
        <p>Small modal content</p>
      </Modal>
    );
    
    let modalElement = screen.getByText('Small Modal').closest('div')?.parentElement?.parentElement;
    expect(modalElement).toHaveClass('max-w-md');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Medium Modal" size="medium">
        <p>Medium modal content</p>
      </Modal>
    );
    
    modalElement = screen.getByText('Medium Modal').closest('div')?.parentElement?.parentElement;
    expect(modalElement).toHaveClass('max-w-2xl');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Large Modal" size="large">
        <p>Large modal content</p>
      </Modal>
    );
    
    modalElement = screen.getByText('Large Modal').closest('div')?.parentElement?.parentElement;
    expect(modalElement).toHaveClass('max-w-4xl');
  });

  test('renders with footer', () => {
    const footer = <div data-testid="modal-footer">Footer content</div>;
    
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal with Footer" footer={footer}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  test('calls onClose when escape key is pressed', () => {
    const onCloseMock = jest.fn();
    
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

describe('ConfirmationModal Component', () => {
  test('renders with default props', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
      />
    );
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('renders with custom button labels', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete Item"
        message="This action cannot be undone."
        cancelLabel="Go Back"
        confirmLabel="Delete"
      />
    );
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('calls onConfirm and onClose when confirm button is clicked', async () => {
    const onCloseMock = jest.fn();
    const onConfirmMock = jest.fn();
    
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm Action"
        message="Are you sure?"
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    await userEvent.click(confirmButton);
    
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when cancel button is clicked', async () => {
    const onCloseMock = jest.fn();
    const onConfirmMock = jest.fn();
    
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm Action"
        message="Are you sure?"
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  test('renders with danger variant', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete Item"
        message="This action cannot be undone."
        confirmVariant="danger"
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});
