import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders title, message and navigation links', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Page not found'
    );

    expect(
      screen.getByText(/the page you are looking for does not exist/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /back to movies/i })
    ).toHaveAttribute('href', '/movies');

    expect(screen.getByRole('link', { name: /about page/i })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});
