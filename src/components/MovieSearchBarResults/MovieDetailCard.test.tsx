import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MovieDetailCard } from './MovieDetailCard';
import { batmanMock } from '../../test-utils/testData';

describe('MovieDetailCard', () => {
  it('renders movie details', () => {
    render(<MovieDetailCard movie={batmanMock} />);

    expect(
      screen.getByRole('heading', { name: /batman begins/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/bruce wayne becomes batman/i)).toBeInTheDocument();

    expect(screen.getByText('2005-06-15')).toBeInTheDocument();
    expect(screen.getByText('8.2')).toBeInTheDocument();
  });

  it('renders movie poster with correct src and alt', () => {
    render(<MovieDetailCard movie={batmanMock} />);

    const poster = screen.getByRole('img', { name: /batman begins/i });

    expect(poster).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/batman.jpg'
    );
    expect(poster).toHaveAttribute('alt', 'Batman Begins');
  });
});
