import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./user-form-rhf.const', () => ({
  __esModule: true,
  strongPw: (v: string) =>
    /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v),
  GENDERS: ['female', 'male', 'other', 'prefer_not'],
}));

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
  usePhotoStore: (sel: any) => sel({ base64: null, saveBase64: vi.fn(), clear: vi.fn() }),
}));

vi.mock('@rs-react/components', () => {
  const TextField = forwardRef<HTMLInputElement, any>(
    (
      {
        name,
        label,
        type = 'text',
        placeholder,
        listId,
        datalistOptions = [],
        error,
        value,
        onChange,
      },
      ref,
    ) => (
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
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {listId && (
          <datalist id={listId}>
            {datalistOptions.map((o: string) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        )}
        {error && <span role="alert">{error}</span>}
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

  const Upload = () => <div data-testid="upload">upload</div>;

  return { __esModule: true, TextField, Radio, Checkbox, Upload };
});

import { UserFormRHF } from './user-form-rhf';

describe('UserFormRHF (simple)', () => {
  it('should toggle validity and submit via onSubmitRefAction', async () => {
    const validitySpy = vi.fn();
    let submitFn: (() => void) | null = null;
    const submitSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <UserFormRHF
        onValidityChangeAction={validitySpy}
        onSubmitRefAction={(fn) => {
          submitFn = fn;
        }}
      />,
    );

    await waitFor(() => {
      expect(validitySpy).toHaveBeenCalledWith(false);
    });

    fireEvent.input(screen.getByTestId('tf-name'), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByTestId('tf-age'), { target: { value: '30' } });
    fireEvent.input(screen.getByTestId('tf-email'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByTestId('tf-password'), { target: { value: 'Aa1!' } });
    fireEvent.input(screen.getByTestId('tf-confirm'), { target: { value: 'Aa1!' } });
    fireEvent.click(screen.getByTestId('radio-male'));
    fireEvent.click(screen.getByTestId('chk-tc'));
    fireEvent.input(screen.getByTestId('tf-country'), { target: { value: 'Canada' } });

    await waitFor(() => {
      expect(validitySpy).toHaveBeenLastCalledWith(true);
    });

    expect(typeof submitFn).toBe('function');

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(1);
    });

    const alertArg = submitSpy.mock.calls[0][0] as string;
    expect(alertArg).toContain('Form submitted');
    expect(alertArg).toContain('"formDataKeys"');
    expect(alertArg).toContain('"name"');
    expect(alertArg).toContain('"email"');
    expect(alertArg).toContain('"password"');
    expect(alertArg).toContain('"confirm"');
    expect(alertArg).toContain('"tc"');
    expect(alertArg).toContain('"country"');

    submitSpy.mockRestore();
  });
});
