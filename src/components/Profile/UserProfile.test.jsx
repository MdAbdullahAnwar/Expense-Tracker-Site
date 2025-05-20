import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

jest.mock('./ProfileForm', () => () => <div>Mocked ProfileForm</div>);

describe('UserProfile Component', () => {
  test('renders the User Profile heading', () => {
    render(<UserProfile />);
    expect(screen.getByText('Your User Profile')).toBeInTheDocument();
  });

  test('renders the ProfileForm component', () => {
    render(<UserProfile />);
    expect(screen.getByText('Mocked ProfileForm')).toBeInTheDocument();
  });
});