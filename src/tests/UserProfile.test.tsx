import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UserProfile from '../components/UserProfile/UserProfile';
import { mockUserData } from './utils/mocs';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

const mockedUseSelector = vi.mocked(useSelector);

describe('UserProfile component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render if there are no submissions', () => {
    mockedUseSelector.mockReturnValue([]);

    const { container } = render(<UserProfile />);
    expect(container.firstChild).toBeNull();
  });

  it('renders submitted users when data is present', () => {
    mockedUseSelector.mockReturnValue([
      mockUserData,
      {
        ...mockUserData,
        name: 'Maria',
        eMail: 'maria@example.com',
        country: 'BY',
      },
    ]);

    render(<UserProfile />);
    expect(screen.getByText(/Submitted users/i)).toBeInTheDocument();
    expect(screen.getByText(/User #1/i)).toBeInTheDocument();
    expect(screen.getByText(/User #2/i)).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getAllByText(/25/)).toHaveLength(2);
    expect(screen.getAllByText(/female/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/alex@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/maria@example.com/)).toBeInTheDocument();
    expect(screen.getAllByAltText(/User photo/i)[0]).toHaveAttribute(
      'src',
      'https://example.com/photo.jpg'
    );
  });
});
