import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { UserFormUncontrolled } from './user-form-uncontrolled';

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: (ns?: string) => (key: string, values?: Record<string, unknown>) => {
    const map: Record<string, string> = {
      'userForm.aria.formLabel': 'Registration Form',
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
      'userForm.errors.file': `File error: ${values?.msg ?? ''}`,
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
      'userForm.fields.picture.hint': 'Upload a picture',
      'userForm.fields.tc.label': 'I accept terms',
    };
    const k = ns ? `${ns}.${key}` : key;
    return map[k] ?? k;
  },
}));

vi.mock('@rs-react/store', () => {
  type Selector<S, R> = (state: S) => R;

  function createHook<S>(state: S) {
    function hook<R>(selector: Selector<S, R>): R {
      return selector(state);
    }
    (hook as unknown as { getState: () => S }).getState = () => state;
    return hook as typeof hook & { getState: () => S };
  }

  const useCountryStore = createHook<{ countries: string[] }>({ countries: ['Canada', 'USA'] });

  const photoState = {
    base64: 'iVBORw0Kabcdef',
    saveBase64: vi.fn<(b: string) => void>(),
    clear: vi.fn<() => void>(),
  };
  const usePhotoStore = createHook<typeof photoState>(photoState);

  const userState = {
    save: vi.fn<(d: unknown) => void>(),
    reset: vi.fn<() => void>(),
    data: {} as Record<string, unknown>,
  };
  const useUserStore = createHook<typeof userState>(userState);

  return {
    __esModule: true,
    useCountryStore,
    usePhotoStore,
    useUserStore,
  };
});

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
}));

type TextFieldProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  listId?: string;
  datalistOptions?: string[];
  error?: string;
  id?: string;
};
type RadioProps = {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (v: string) => void;
};
type CheckboxProps = {
  name: string;
  label: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  required?: boolean;
};
type UploadProps = {
  id?: string;
  name?: string;
  hint?: string;
  error?: string;
  onError?: (msg?: string) => void;
  onValidFile?: (p: { base64: string }) => void;
};

vi.mock('@rs-react/components', () => {
  const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ name, label, type = 'text', placeholder, listId, datalistOptions = [], error, id }, ref) => (
      <div>
        {label ? <label htmlFor={id ?? name}>{label}</label> : null}
        <input
          ref={ref}
          id={id ?? name}
          name={name}
          type={type}
          aria-label={label ?? name}
          placeholder={placeholder}
          list={listId}
          data-testid={`tf-${name}`}
        />
        {listId ? (
          <datalist id={listId}>
            {datalistOptions.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        ) : null}
        {error ? <span role="alert">{error}</span> : null}
      </div>
    ),
  );
  TextField.displayName = 'TextField';

  const Radio = ({ name, value, label, checked, onChange }: RadioProps) => (
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

  const Checkbox = ({ name, label, checked, onChange, required }: CheckboxProps) => (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
        data-testid={`chk-${name}`}
        aria-required={required}
      />
      {label}
    </label>
  );

  const Upload: React.FC<UploadProps> = () => <div data-testid="upload">upload</div>;

  return { __esModule: true, TextField, Radio, Checkbox, Upload };
});

describe('UserFormUncontrolled', () => {
  it('should show validation errors on empty submit', () => {
    const onValidity = vi.fn();
    const onSubmit = vi.fn();
    render(<UserFormUncontrolled onValidityChange={onValidity} onSubmit={onSubmit} />);
    const form = screen.getByRole('form', { name: 'Registration Form' });
    fireEvent.submit(form);
    expect(screen.getByText('Name is invalid')).toBeInTheDocument();
    expect(screen.getByText('Age is required')).toBeInTheDocument();
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Gender is required')).toBeInTheDocument();
    expect(screen.getByText('You must accept terms')).toBeInTheDocument();
  });

  it('should submit valid data', () => {
    const onSubmit = vi.fn();
    render(<UserFormUncontrolled onSubmit={onSubmit} />);
    fireEvent.input(screen.getByTestId('tf-name'), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByTestId('tf-age'), { target: { value: '30' } });
    fireEvent.input(screen.getByTestId('tf-email'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByTestId('tf-password'), { target: { value: 'Aa1!' } });
    fireEvent.input(screen.getByTestId('tf-confirm'), { target: { value: 'Aa1!' } });
    fireEvent.click(screen.getByTestId('radio-male'));
    fireEvent.input(screen.getByTestId('tf-country'), { target: { value: 'Canada' } });
    fireEvent.click(screen.getByTestId('chk-tc'));
    const form = screen.getByRole('form', { name: 'Registration Form' });
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0] as Record<string, FormDataEntryValue>;
    expect(payload.name).toBe('John Doe');
    expect(payload.email).toBe('john@example.com');
    expect(payload.gender).toBe('male');
  });
});
