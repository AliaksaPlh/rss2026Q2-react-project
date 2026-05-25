import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import ToggleThemeButton from './ThemeToggle';
import { useTheme } from '../../Context/useTheme';
import { LIGHT } from '../../consts';

vi.mock('../../Context/useTheme', () => ({
  useTheme: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ToggleThemeButton', () => {
  it('Show icon and toggle theme', () => {
    const mockToggle = vi.fn();
    (useTheme as Mock).mockReturnValue({
      theme: LIGHT,
      toggleTheme: mockToggle,
    });

    render(<ToggleThemeButton />);

    const button = screen.getByRole('button', {
      name: /switch to dark theme/i,
    });

    expect(screen.getByText(/light/i)).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalled();
  });
});
