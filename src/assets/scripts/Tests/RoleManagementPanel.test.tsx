import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoleManagementPanel from '../Panels/RoleManagementPanel';
import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
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
      expect(screen.getAllByTestId('first-name-input')[0]).toBeInTheDocument();
    });

    const firstNameInput = screen.getAllByTestId('first-name-input')[0];
    const lastNameInput = screen.getAllByTestId('last-name-input')[0];

    fireEvent.change(firstNameInput, { target: { value: 'احمد' } });
    fireEvent.change(lastNameInput, { target: { value: 'باقری' } });

    await waitFor(() => {
      expect(screen.getAllByText('احمد باقری')[0]).toBeInTheDocument();
    });
  });

  test('should change احمد باقری role to ادمین and persist after refresh', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('first-name-input')[0]).toBeInTheDocument();
    });

    fireEvent.change(screen.getAllByTestId('first-name-input')[0], {
      target: { value: 'احمد' },
    });
    fireEvent.change(screen.getAllByTestId('last-name-input')[0], {
      target: { value: 'باقری' },
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('role-dropdown-احمد-باقری')[0]).toBeInTheDocument();
    });

    const roleSelect = screen.getAllByTestId('role-dropdown-احمد-باقری')[0];
    fireEvent.change(roleSelect, { target: { value: 'ادمین' } });

    rerender(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      const updatedSelect = screen.getAllByTestId('role-dropdown-احمد-باقری')[0];
      expect(updatedSelect).toHaveValue('ادمین');
    });
  });

  test("should see page number 6 after clicking on بعدی button", async () => {
    render(
      <BrowserRouter>
        <RoleManagementPanel />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('page-1')).toBeInTheDocument();
    });

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('page-6')).toBeInTheDocument();
      expect(screen.queryByTestId('page-1')).not.toBeInTheDocument();
    });
  });
});



