import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutMePage from './AboutMe';

describe('AboutMePage', () => {
  it('renders author information and links', () => {
    render(
      <MemoryRouter>
        <AboutMePage />
      </MemoryRouter>
    );

    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Aliaksandra'
    );
    expect(screen.getByText('Download CV')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/AliaksaPlh'
    );
    expect(
      screen.getByRole('link', { name: /rs school react course/i })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(
      screen.getByRole('link', { name: /back to movies/i })
    ).toHaveAttribute('href', '/movies');
  });
});
