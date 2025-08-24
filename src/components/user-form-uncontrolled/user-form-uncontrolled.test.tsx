import { render, screen, fireEvent } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@rs-react/constants', () => ({
  __esModule: true,
  NAME_REGEX: /^[A-Za-z ].{1,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordRequirements: (pwd: string) => ({
    number: /\d/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  }),
  USER_VALIDATION_MSG: {
    nameInvalid: 'Name is invalid',
    ageRequired: 'Age is required',
    ageNegative: 'Age cannot be negative',
    emailInvalid: 'Email is invalid',
    passwordRequired: 'Password is required',
    passwordWeak: 'Password is too weak',
    confirmMismatch: 'Passwords do not match',
    genderRequired: 'Gender is required',
    tcRequired: 'You must accept terms',
    countryInvalid: 'Invalid country',
  },
}));

vi.mock('@rs-react/store', () => ({
  __esModule: true,
  useCountryStore: (sel: any) => sel({ countries: ['Canada', 'USA'] }),
  usePhotoStore: (sel: any) => sel({ saveBase64: vi.fn(), clear: vi.fn() }),
}));

vi.mock('@rs-react/components', () => {
  const TextField = forwardRef<HTMLInputElement, any>(
    ({ name, label, type = 'text', placeholder, listId, datalistOptions = [], error }, ref) => (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          aria-label={label || name}
          placeholder={placeholder}
          list={listId}
          data-testid={`tf-${name}`}
        />
        {listId && (
          <datalist id={listId}>
            {datalistOptions.map((o: string) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        )}
        {error && <span data-testid={`err-${name}`}>{error}</span>}
      </div>
    ),
  );

  const Radio = ({ name, value, label, checked, onChange }: any) => (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={!!checked}
        onChange={() => onChange?.(value)}
        data-testid={`radio-${value}`}
      />
      {label}
    </label>
  );

  const Checkbox = ({ name, label, checked, onChange }: any) => (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        data-testid={`chk-${name}`}
      />
      {label}
    </label>
  );

  const Upload = (_: any) => <div data-testid="upload">upload</div>;

  return { __esModule: true, TextField, Radio, Checkbox, Upload };
});

import { UserFormUncontrolled } from './user-form-uncontrolled';

describe('UserFormUncontrolled (simple)', () => {
  it('should show basic validation errors on empty submit', async () => {
    render(<UserFormUncontrolled />);

    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(await screen.findByTestId('err-name')).toHaveTextContent('Name is invalid');
    expect(await screen.findByTestId('err-age')).toHaveTextContent('Age is required');
    expect(await screen.findByTestId('err-email')).toHaveTextContent('Email is invalid');
    expect(await screen.findByTestId('err-password')).toHaveTextContent('Password is required');
    expect(await screen.findByText('Gender is required')).toBeInTheDocument();
    expect(await screen.findByText('You must accept terms')).toBeInTheDocument();
  });
});
