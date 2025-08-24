import { render, screen, fireEvent } from '@testing-library/react';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

vi.mock('@rs-react/components/shared', () => {
  type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { text?: string };
  const Button: React.FC<ButtonProps> = ({ onClick, text, ...rest }) => (
    <button onClick={onClick} {...rest}>
      {text}
    </button>
  );

  type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitDisabled?: boolean;
    title?: string;
    children?: ReactNode;
  };
  const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitDisabled,
    title,
    children,
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="dialog">
        <h2>{title}</h2>
        <div>{children}</div>
        <div>
          <button onClick={onClose}>Close</button>
          <button onClick={onSubmit} disabled={!!isSubmitDisabled}>
            Submit
          </button>
        </div>
      </div>
    );
  };

  return { __esModule: true, Button, Dialog };
});

vi.mock('@rs-react/components', () => {
  type UncontrolledHandle = { submit: () => void };
  const UserFormUncontrolled = forwardRef<UncontrolledHandle, Record<string, never>>(
    (_props, ref) => {
      const submit = vi.fn();
      useImperativeHandle(ref, () => ({ submit }));
      return <div data-testid="uncontrolled-form">Uncontrolled Form</div>;
    },
  );

  type RHFProps = {
    onValidityChangeAction?: (valid: boolean) => void;
    onSubmitRefAction?: (fn: () => void) => void;
  };
  const UserFormRHF: React.FC<RHFProps> = ({ onValidityChangeAction, onSubmitRefAction }) => {
    const [submitCount, setSubmitCount] = useState(0);
    useEffect(() => {
      const submitFn = () => setSubmitCount((c) => c + 1);
      onSubmitRefAction?.(submitFn);
    }, [onSubmitRefAction]);
    return (
      <div data-testid="rhf-form">
        <div data-testid="rhf-submit-count">{submitCount}</div>
        <button data-testid="make-valid" onClick={() => onValidityChangeAction?.(true)}>
          make-valid
        </button>
        <button data-testid="make-invalid" onClick={() => onValidityChangeAction?.(false)}>
          make-invalid
        </button>
      </div>
    );
  };

  return {
    __esModule: true,
    UserFormRHF,
    UserFormUncontrolled,
  };
});

import { UserForms } from './user-forms';

describe('UserForms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open Uncontrolled form, call submit, and close', () => {
    render(<UserForms />);
    fireEvent.click(screen.getByRole('button', { name: /open uncontrolled form/i }));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should enable RHF submit when valid and call submit', () => {
    render(<UserForms />);
    fireEvent.click(screen.getByRole('button', { name: /open react hook form/i }));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
    fireEvent.click(screen.getByTestId('make-valid'));
    expect(submitBtn).not.toBeDisabled();
    expect(screen.getByTestId('rhf-submit-count').textContent).toBe('0');
    fireEvent.click(submitBtn);
    expect(screen.getByTestId('rhf-submit-count').textContent).toBe('1');
  });

  it('should reset RHF submit disabled state after close', () => {
    render(<UserForms />);
    fireEvent.click(screen.getByRole('button', { name: /open react hook form/i }));
    let submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(screen.getByTestId('make-valid'));
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /open react hook form/i }));
    submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });
});
