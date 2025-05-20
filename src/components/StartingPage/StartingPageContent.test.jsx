import React from 'react';
import { render, screen } from '@testing-library/react';
import StartingPageContent from './StartingPageContent';

describe('StartingPageContent Component', () => {
  it('renders the welcome message', () => {
    render(<StartingPageContent />);
    
    const heading = screen.getByRole('heading', {
      name: /welcome to expense tracker/i,
    });

    expect(heading).toBeInTheDocument();
  });
});