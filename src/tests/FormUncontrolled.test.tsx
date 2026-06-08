import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../components/store/store';
import FormUncontrolled from '../components/Forms/FormUncontrolled/FormUncontrolled';

export const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('Form', () => {
  it('render allform fields', () => {
    renderWithProvider(<FormUncontrolled />);
    expect(screen.getByTestId(/name/i)).toBeInTheDocument();
    expect(screen.getByTestId(/age/i)).toBeInTheDocument();
    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId(/gender/i)).toBeInTheDocument();
    expect(screen.getByTestId(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId(/checkPsw/i)).toBeInTheDocument();
    expect(screen.getByTestId(/photo/i)).toBeInTheDocument();
    expect(screen.getByTestId(/terms/i)).toBeInTheDocument();
    expect(screen.getByTestId(/country/i)).toBeInTheDocument();
  });

  it('does not show validation errors before submit', () => {
    renderWithProvider(<FormUncontrolled />);

    fireEvent.change(screen.getByTestId('name'), {
      target: { value: 'alex' },
    });
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'alexexamplecom' },
    });

    expect(screen.queryByText(/first letter must be uppercase/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it('shows password strength rules and updates them while typing', async () => {
    renderWithProvider(<FormUncontrolled />);

    expect(screen.getByLabelText(/password strength/i)).toBeInTheDocument();
    expect(screen.getByText(/1 number/i)).toBeInTheDocument();
    expect(screen.getByText(/1 uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/1 special character/i)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Abcdef123456!' },
    });

    await waitFor(() => {
      expect(screen.getAllByText('Met')).toHaveLength(4);
    });
  });

  it('renders country autocomplete options from the store', () => {
    renderWithProvider(<FormUncontrolled />);

    expect(screen.getByTestId('country')).toHaveAttribute(
      'list',
      'uncontrolled-country-options'
    );
    expect(
      document.querySelector('#uncontrolled-country-options option[value="BY"]')
    ).toHaveTextContent('Belarus');
  });

  it('validation', async () => {
    renderWithProvider(<FormUncontrolled />);

    const nameInput = screen.getByTestId('name');
    const ageInput = screen.getByTestId('age');
    const emailInput = screen.getByTestId('email');
    const passwordInput = screen.getByTestId('password');
    const checkPasswordInput = screen.getByTestId('checkPsw');
    const photoInput = screen.getByTestId('photo');
    const termsInput = screen.getByTestId('terms');
    const countryInput = screen.getByTestId('country');
    fireEvent.change(photoInput, {
      target: {
        files: [new File(['photo'], 'photo.png', { type: 'image/png' })],
      },
    });
    fireEvent.change(countryInput, { target: { value: 'BY' } });
    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(ageInput, { target: { value: '25' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'abcABC123456!' } });
    fireEvent.change(checkPasswordInput, {
      target: { value: 'abcABC123456!' },
    });
    fireEvent.change(termsInput, { target: { checked: true } });
    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/age is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/password is required, at least 6 characters/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/you need to confirm password correctly/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/you must accept Terms and Conditions agreement/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Photo is required/i)).not.toBeInTheDocument();
    });
  });

  it('shows validation error for unsupported image type after submit', async () => {
    renderWithProvider(<FormUncontrolled />);

    fireEvent.change(screen.getByTestId('photo'), {
      target: {
        files: [new File(['photo'], 'photo.gif', { type: 'image/gif' })],
      },
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(screen.getByText(/only png or jpeg allowed/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when image is larger than 2MB after submit', async () => {
    renderWithProvider(<FormUncontrolled />);
    const largeFile = new File([new Uint8Array(2_000_001)], 'photo.png', {
      type: 'image/png',
    });

    fireEvent.change(screen.getByTestId('photo'), {
      target: {
        files: [largeFile],
      },
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(screen.getByText(/file must be less than 2mb/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when country does not exist in countries list', async () => {
    renderWithProvider(<FormUncontrolled />);

    fireEvent.change(screen.getByTestId('country'), {
      target: { value: 'INVALID' },
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(screen.getByText(/select a country/i)).toBeInTheDocument();
    });
  });

  it('validation check if password and check password are the same', async () => {
    renderWithProvider(<FormUncontrolled />);
    const passwordInput = screen.getByTestId('password');
    const checkPasswordInput = screen.getByTestId('checkPsw');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(passwordInput, { target: { value: 'abcABC123456!' } });
    fireEvent.change(checkPasswordInput, {
      target: { value: 'abcABC123456!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage =
        screen.queryByText(/need to confirm/i) ||
        screen.queryByText(/password correctly/i);
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
  it('validation check for name', async () => {
    renderWithProvider(<FormUncontrolled />);
    const nameInput = screen.getByTestId('name');
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'Alexa' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage =
        screen.queryByText(/with a capital letter/i) ||
        screen.queryByText(/name is required/i);
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it('submits valid data and calls onClose', async () => {
    const onClose = vi.fn();

    renderWithProvider(<FormUncontrolled onClose={onClose} />);

    fireEvent.change(screen.getByTestId('name'), {
      target: { value: 'Alex' },
    });
    fireEvent.change(screen.getByTestId('age'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByTestId('gender'), {
      target: { value: 'female' },
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'abcABC123456!' },
    });
    fireEvent.change(screen.getByTestId('checkPsw'), {
      target: { value: 'abcABC123456!' },
    });
    fireEvent.change(screen.getByTestId('photo'), {
      target: {
        files: [new File(['photo'], 'photo.png', { type: 'image/png' })],
      },
    });
    fireEvent.click(screen.getByTestId('terms'));
    fireEvent.change(screen.getByTestId('country'), {
      target: { value: 'BY' },
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
