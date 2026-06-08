import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Form from '../components/Forms/FormControled/Form';
import { Provider } from 'react-redux';
import { store } from '../components/store/store';

export const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('Form', () => {
  it('render allform fields', () => {
    renderWithProvider(<Form />);
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

  it('validation name: submit button is disabled when name is invalid', async () => {
    renderWithProvider(<Form />);

    const nameInput = screen.getByTestId(/name/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(nameInput, { target: { value: 'alex' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('validation age: submit button is disabled when age is invalid', async () => {
    renderWithProvider(<Form />);

    const ageInput = screen.getByTestId(/age/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(ageInput, { target: { value: '-1' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('validation email: submit button is disabled when email is invalid', async () => {
    renderWithProvider(<Form />);

    const emailInput = screen.getByTestId(/email/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(emailInput, { target: { value: 'alexexamplecom' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('validation password: submit button is disabled when password is invalid', async () => {
    renderWithProvider(<Form />);

    const passwordInput = screen.getByTestId(/password/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(passwordInput, { target: { value: '123' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('validation check password submission: submit button is disabled when password and check password are not the same', async () => {
    renderWithProvider(<Form />);

    const passwordInput = screen.getByTestId(/password/i);
    const checkPasswordInput = screen.getByTestId(/checkPsw/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(passwordInput, { target: { value: 'abcABC123456!' } });
    fireEvent.change(checkPasswordInput, {
      target: { value: 'abcABC123457!' },
    });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
  it('shows password strength rules and updates them while typing', async () => {
    renderWithProvider(<Form />);

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
    renderWithProvider(<Form />);

    expect(screen.getByTestId('country')).toHaveAttribute(
      'list',
      'controlled-country-options'
    );
    expect(
      document.querySelector('#controlled-country-options option[value="BY"]')
    ).toHaveTextContent('Belarus');
  });

  it('validation photo: submit button is disabled when photo is invalid', async () => {
    renderWithProvider(<Form />);

    const photoInput = screen.getByTestId(/photo/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(photoInput, {
      target: {
        files: null,
      },
    });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('keeps submit disabled when image type is unsupported', async () => {
    renderWithProvider(<Form />);

    fireEvent.change(screen.getByTestId('photo'), {
      target: {
        files: [new File(['photo'], 'photo.gif', { type: 'image/gif' })],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).toBeDisabled();
    });
  });

  it('keeps submit disabled when image is larger than 2MB', async () => {
    renderWithProvider(<Form />);
    const largeFile = new File([new Uint8Array(2_000_001)], 'photo.png', {
      type: 'image/png',
    });

    fireEvent.change(screen.getByTestId('photo'), {
      target: {
        files: [largeFile],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).toBeDisabled();
    });
  });

  it('validation terms: submit button is disabled when terms are not accepted', async () => {
    renderWithProvider(<Form />);

    const termsInput = screen.getByTestId(/terms/i);
    const submitButton = screen.getByTestId('submit');

    fireEvent.change(termsInput, { target: { checked: false } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
  it('disables submit when country does not exist in countries list', async () => {
    renderWithProvider(<Form />);

    fireEvent.change(screen.getByTestId('country'), {
      target: { value: 'INVALID' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('submit')).toBeDisabled();
      expect(screen.getByText(/select a country/i)).toBeInTheDocument();
    });
  });
  it('validation submit button is enabled when validation is successful', async () => {
    renderWithProvider(<Form />);
    const nameInput = screen.getByTestId('name');
    const ageInput = screen.getByTestId('age');
    const emailInput = screen.getByTestId('email');
    const genderInput = screen.getByTestId('gender');
    const passwordInput = screen.getByTestId('password');
    const checkPasswordInput = screen.getByTestId('checkPsw');
    const termsInput = screen.getByTestId('terms');
    const photoInput = screen.getByTestId('photo');
    const countryInput = screen.getByTestId('country');

    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(ageInput, { target: { value: '25' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(genderInput, { target: { value: 'female' } });
    fireEvent.change(passwordInput, { target: { value: 'abcABC123456!' } });
    fireEvent.change(checkPasswordInput, {
      target: { value: 'abcABC123456!' },
    });
    fireEvent.click(termsInput);
    fireEvent.change(photoInput, {
      target: {
        files: [new File(['photo'], 'photo.png', { type: 'image/png' })],
      },
    });
    fireEvent.change(countryInput, { target: { value: 'BY' } });

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
      expect(screen.getByTestId('submit')).toBeEnabled();
    });
  });

  it('submits valid data and calls onClose', async () => {
    const onClose = vi.fn();

    renderWithProvider(<Form onClose={onClose} />);

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

    await waitFor(() => {
      expect(screen.getByTestId('submit')).toBeEnabled();
    });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
