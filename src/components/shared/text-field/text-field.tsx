import classNames from 'classnames';
import React from 'react';
import './text-field.css';

export interface TextFieldProps {
  id?: string;
  label?: string | React.ReactNode;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'number';
  placeholder?: string;
  autoComplete?: string;
  listId?: string;
  datalistOptions?: string[];

  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;

  className?: string;
  hint?: React.ReactNode;
  error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      name,
      type = 'text',
      placeholder,
      autoComplete,
      listId,
      datalistOptions,
      value,
      defaultValue,
      onChange,
      required = false,
      disabled = false,
      readOnly = false,
      maxLength = 30,
      className,
      hint,
      error,
    },
    ref,
  ) => {
    const controlProps: { value?: string; defaultValue?: string } = {};
    if (value !== undefined) controlProps.value = value;
    else if (defaultValue !== undefined) controlProps.defaultValue = defaultValue;

    const wrapperClass = classNames('text-field', className, {
      disabled,
      invalid: !!error,
    });

    return (
      <div className={wrapperClass}>
        {label && (
          <label className="text-field-label" {...(id ? { htmlFor: id } : {})}>
            {label}
          </label>
        )}

        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          className="text-field-input"
          placeholder={placeholder}
          autoComplete={autoComplete}
          list={listId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          {...controlProps}
          onChange={(e) => onChange?.(e.target.value)}
        />

        {datalistOptions && listId && (
          <datalist id={listId}>
            {datalistOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        )}

        {error ? <p className="text-field-error">{error}</p> : null}
        {!error && hint ? <p className="text-field-hint">{hint}</p> : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
