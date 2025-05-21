import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoleManagementPanel from '../Panels/RoleManagementPanel';
import "@testing-library/jest-dom";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('RoleManagementPanel Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should filter users by first and last name', async () => {
    render(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');

    fireEvent.change(firstNameInput, { target: { value: 'احمد' } });
    fireEvent.change(lastNameInput, { target: { value: 'باقری' } });

    await waitFor(() => {
      expect(screen.getByText('احمد باقری')).toBeInTheDocument();
    });
  });

  test('should change احمد باقری role to ادمین and persist after refresh', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
    });

    // Search for احمد باقری
    fireEvent.change(screen.getByTestId('first-name-input'), {
      target: { value: 'احمد' },
    });
    fireEvent.change(screen.getByTestId('last-name-input'), {
      target: { value: 'باقری' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('role-dropdown-احمد-باقری')).toBeInTheDocument();
    });

    const roleSelect = screen.getByTestId('role-dropdown-احمد-باقری');
    fireEvent.change(roleSelect, { target: { value: 'ادمین' } });

    // Simulate refresh
    rerender(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      const updatedSelect = screen.getByTestId('role-dropdown-احمد-باقری');
      expect(updatedSelect).toHaveValue('ادمین');
    });
  });
});



