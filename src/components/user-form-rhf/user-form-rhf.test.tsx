import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { UserFormRHF } from './user-form-rhf';

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: (ns?: string) => (key: string, values?: Record<string, unknown>) => {
    void values;
    const map: Record<string, string> = {
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
      'userForm.fields.confirm.label': 'Confirm',
      'userForm.fields.confirm.placeholder': 'Confirm password',
      'userForm.fields.gender.label': 'Gender',
      'userForm.fields.gender.options.female': 'Female',
      'userForm.fields.gender.options.male': 'Male',
      'userForm.fields.gender.options.other': 'Other',
      'userForm.fields.country.label': 'Country',
      'userForm.fields.country.placeholder': 'Select country',
      'userForm.fields.tc.label': 'I accept terms',
      'userForm.fields.picture.hint': 'Upload a picture',
      'userForm.fields.picture.hintSaved': 'Picture saved',
    };
    const resolved = ns ? `${ns}.${key}` : key;
    return map[resolved] ?? resolved;
  },
}));

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
}));

const saveBase64Spy = vi.fn();
vi.mock('@rs-react/store', () => ({
  __esModule: true,
  useCountryStore: (sel: (s: { countries: string[] }) => unknown) =>
    sel({ countries: ['Canada', 'USA'] }),
  usePhotoStore: (
    sel: (s: { base64: string | null; saveBase64: (b: string) => void }) => unknown,
  ) => sel({ base64: null, saveBase64: saveBase64Spy }),
}));

type TFProps = {
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
};
type RadioProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (v: string) => void;
};
type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};
type UploadProps = {
  error?: string;
  onError?: (msg?: string) => void;
  onValidFile?: (info: { base64: string; file: File }) => void;
};

vi.mock('@rs-react/components', () => {
  const TextField = forwardRef<HTMLInputElement, TFProps>(
    (
      {
        name,
        label,
        type = 'text',
        placeholder,
        listId,
        datalistOptions = [],
        value,
        onChange,
        error,
        id,
      },
      ref,
    ) => (
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
          value={value ?? ''}
          onChange={(e) => onChange?.(e.currentTarget.value)}
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

  const Checkbox: React.FC<CheckboxProps> = ({ name, label, checked, onChange }) => (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        data-testid={`chk-${name}`}
      />
      {label}
    </label>
  );

  const Upload: React.FC<UploadProps> = ({ error, onError, onValidFile }) => (
    <div>
      {error ? <div role="alert">{error}</div> : null}
      <button type="button" onClick={() => onError?.('File too large')} data-testid="upload-error">
        Trigger Upload Error
      </button>
      <button
        type="button"
        onClick={() =>
          onValidFile?.({ base64: 'AAA', file: new File(['x'], 'ok.png', { type: 'image/png' }) })
        }
        data-testid="upload-ok"
      >
        Trigger Upload OK
      </button>
    </div>
  );

  return { __esModule: true, TextField, Radio, Checkbox, Upload };
});

describe('UserFormRHF', () => {
  it('should start invalid, become valid, and submit via onSubmitRefAction', async () => {
    const validitySpy = vi.fn();
    const holder: { submit?: () => void } = {};
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <UserFormRHF
        onValidityChangeAction={validitySpy}
        onSubmitRefAction={(fn) => {
          holder.submit = fn;
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
    fireEvent.input(screen.getByTestId('tf-country'), { target: { value: 'Canada' } });
    fireEvent.click(screen.getByTestId('chk-tc'));

    await waitFor(() => {
      expect(validitySpy).toHaveBeenLastCalledWith(true);
    });

    if (!holder.submit) throw new Error('submit function not set');
    holder.submit();

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });

    alertSpy.mockRestore();
  });

  it('should set and clear root error via upload interactions', async () => {
    render(<UserFormRHF />);
    fireEvent.click(screen.getByTestId('upload-error'));
    expect(await screen.findByRole('alert')).toHaveTextContent('File too large');
    fireEvent.click(screen.getByTestId('upload-ok'));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull();
    });
    expect(saveBase64Spy).toHaveBeenCalledWith('AAA');
  });
});
