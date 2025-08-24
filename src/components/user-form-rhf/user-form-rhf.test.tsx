import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

const h = vi.hoisted(() => ({
  saveBase64Spy: vi.fn(),
  saveUserSpy: vi.fn(),
}));

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    void values;
    const m: Record<string, string> = {
      'userForm.errors.nameInvalid': 'Name is invalid',
      'userForm.errors.ageRequired': 'Age is required',
      'userForm.errors.ageNegative': 'Age cannot be negative',
      'userForm.errors.emailInvalid': 'Email is invalid',
      'userForm.errors.passwordRequired': 'Password is required',
      'userForm.errors.passwordWeak': 'Password is too weak',
      'userForm.errors.confirmMismatch': 'Passwords do not match',
      'userForm.errors.genderRequired': 'Gender is required',
      'userForm.errors.tcRequired': 'You must accept terms',
      'userForm.errors.countryInvalid': 'Invalid country',
      'userForm.fields.name.label': 'Name',
      'userForm.fields.name.placeholder': 'Enter name',
      'userForm.fields.age.label': 'Age',
      'userForm.fields.age.placeholder': 'Enter age',
      'userForm.fields.email.label': 'Email',
      'userForm.fields.email.placeholder': 'Enter email',
      'userForm.fields.password.label': 'Password',
      'userForm.fields.password.placeholder': 'Enter password',
      'userForm.fields.confirm.label': 'Confirm',
      'userForm.fields.confirm.placeholder': 'Confirm password',
      'userForm.fields.gender.label': 'Gender',
      'userForm.fields.gender.options.female': 'Female',
      'userForm.fields.gender.options.male': 'Male',
      'userForm.fields.gender.options.other': 'Other',
      'userForm.fields.country.label': 'Country',
      'userForm.fields.country.placeholder': 'Select country',
      'userForm.fields.tc.label': 'I accept terms',
    };
    return m[key] ?? key;
  },
}));

vi.mock('./user-form-rhf.const', () => ({
  __esModule: true,
  strongPw: (v: string) =>
    /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v),
  GENDERS: ['female', 'male', 'other'],
}));

vi.mock('@rs-react/constants', () => ({
  __esModule: true,
  NAME_REGEX: /^[A-Za-z][A-Za-z ]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}));

vi.mock('@rs-react/store', () => {
  const photo = { base64: null as string | null, saveBase64: h.saveBase64Spy, clear: vi.fn() };
  const useCountryStore = (sel: (s: { countries: string[] }) => unknown) =>
    sel({ countries: ['Canada', 'USA'] });
  const usePhotoStore = (sel: (s: typeof photo) => unknown) => sel(photo);
  (usePhotoStore as unknown as { getState: () => typeof photo }).getState = () => photo;
  const useUserStore = (sel: (s: { save: (v: unknown) => void }) => unknown) =>
    sel({ save: h.saveUserSpy });
  return { __esModule: true, useCountryStore, usePhotoStore, useUserStore };
});

vi.mock('@rs-react/components', () => {
  type TextFieldProps = {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    listId?: string;
    datalistOptions?: string[];
    value?: string;
    onChange?: (v: string) => void;
    error?: string;
    id?: string;
  } & Record<string, unknown>;

  const TextField: React.FC<TextFieldProps> = (p) => (
    <div>
      {p.label ? <label htmlFor={p.id ?? p.name}>{p.label}</label> : null}
      <input
        id={p.id ?? p.name}
        name={p.name}
        type={p.type ?? 'text'}
        aria-label={p.label ?? p.name}
        placeholder={p.placeholder}
        list={p.listId}
        data-testid={`tf-${p.name}`}
        value={p.value ?? ''}
        onChange={(e) => p.onChange?.(e.currentTarget.value)}
      />
      {p.listId ? (
        <datalist id={p.listId}>
          {(p.datalistOptions ?? []).map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      ) : null}
      {p.error ? <span role="alert">{p.error}</span> : null}
    </div>
  );

  type RadioProps = {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (v: string) => void;
  };

  const Radio: React.FC<RadioProps> = ({ name, value, label, checked, onChange }) => (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        data-testid={`radio-${value}`}
      />
      {label}
    </label>
  );

  type CheckboxProps = {
    name: string;
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    required?: boolean;
  };

  const Checkbox: React.FC<CheckboxProps> = ({ name, label, checked, onChange, required }) => (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        data-testid={`chk-${name}`}
        required={required}
      />
      {label}
    </label>
  );

  type UploadProps = {
    id?: string;
    name?: string;
    error?: string;
    onError?: (msg?: string) => void;
    onValidFile?: (info: { base64: string; file: File }) => void;
  };

  const Upload: React.FC<UploadProps> = ({ error, onError, onValidFile }) => (
    <div>
      {error ? <div role="alert">{error}</div> : null}
      <button type="button" data-testid="upload-error" onClick={() => onError?.('Too big')}>
        Err
      </button>
      <button
        type="button"
        data-testid="upload-ok"
        onClick={() =>
          onValidFile?.({ base64: 'AAA', file: new File(['x'], 'a.png', { type: 'image/png' }) })
        }
      >
        Ok
      </button>
    </div>
  );

  return { __esModule: true, TextField, Radio, Checkbox, Upload };
});

import { UserFormRHF } from './user-form-rhf';

describe('UserFormRHF', () => {
  it('validates, submits via onSubmitRefAction, and handles upload flow', async () => {
    const validitySpy = vi.fn();
    let submitFn: (() => void) | undefined;

    render(
      <UserFormRHF
        onValidityChangeAction={validitySpy}
        onSubmitRefAction={(fn) => {
          submitFn = fn;
        }}
      />,
    );

    await waitFor(() => expect(validitySpy).toHaveBeenCalledWith(false));

    fireEvent.input(screen.getByTestId('tf-name'), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByTestId('tf-age'), { target: { value: '30' } });
    fireEvent.input(screen.getByTestId('tf-email'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByTestId('tf-password'), { target: { value: 'Aa1!' } });
    fireEvent.input(screen.getByTestId('tf-confirm'), { target: { value: 'Aa1!' } });
    fireEvent.click(screen.getByTestId('radio-male'));
    fireEvent.input(screen.getByTestId('tf-country'), { target: { value: 'Canada' } });
    fireEvent.click(screen.getByTestId('chk-tc'));

    await waitFor(() => expect(validitySpy).toHaveBeenLastCalledWith(true));

    expect(submitFn).toBeTruthy();
    submitFn?.();

    await waitFor(() => expect(h.saveUserSpy).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId('upload-error'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too big');

    fireEvent.click(screen.getByTestId('upload-ok'));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(h.saveBase64Spy).toHaveBeenCalledWith('AAA');
  });
});
