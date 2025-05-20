import React from 'react';
import { render, screen } from '@testing-library/react';
import AddExpensePage from './AddExpensePage';

jest.mock('./AddExpenseForm', () => () => (
  <div data-testid="add-expense-form">Mocked Form</div>
));

describe('AddExpensePage', () => {
  test('renders "Add Expenses" heading', () => {
    render(<AddExpensePage />);
    expect(screen.getByRole('heading', { name: /add expenses/i })).toBeInTheDocument();
  });

  test('renders the AddExpenseForm component', () => {
    render(<AddExpensePage />);
    expect(screen.getByTestId('add-expense-form')).toBeInTheDocument();
  });
});