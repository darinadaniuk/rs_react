import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { forwardRef, useEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { UserForms } from './user-forms';

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: (ns?: string) => (key: string) => {
    const map: Record<string, string> = {
      'userForm.buttons.openUncontrolled': 'Open Uncontrolled Form',
      'userForm.buttons.openRHF': 'Open React Hook Form',
      'userForm.title': 'My Dialog',
    };
    const k = ns ? `${ns}.${key}` : key;
    return map[k] ?? k;
  },
}));

vi.mock('@rs-react/components/shared', () => {
  const Button: React.FC<{ text: string; onClick?: () => void; disabled?: boolean }> = ({
    text,
    onClick,
    disabled,
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
  Button.displayName = 'Button';

  const Dialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isSubmitDisabled?: boolean;
    title?: string;
    children?: React.ReactNode;
  }> = ({ isOpen, onClose, onSubmit, isSubmitDisabled, title, children }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="dialog">
        <h2>{title}</h2>
        <div>{children}</div>
        <button type="button" onClick={onClose}>
          Close
        </button>
        <button type="button" onClick={onSubmit} disabled={!!isSubmitDisabled}>
          Submit
        </button>
      </div>
    );
  };
  Dialog.displayName = 'Dialog';

  return { __esModule: true, Button, Dialog };
});

vi.mock('@rs-react/components', () => {
  type UncontrolledHandle = { submit: () => void };

  const UserFormUncontrolled = forwardRef<UncontrolledHandle, Record<string, never>>(
    (_props, ref) => {
      const submit = vi.fn();
      React.useImperativeHandle(ref, () => ({ submit }));
      return <div data-testid="uncontrolled-form">Uncontrolled Form</div>;
    },
  );
  UserFormUncontrolled.displayName = 'UserFormUncontrolled';

  const UserFormRHF: React.FC<{
    onValidityChangeAction?: (valid: boolean) => void;
    onSubmitRefAction?: (fn: () => void) => void;
  }> = ({ onValidityChangeAction, onSubmitRefAction }) => {
    useEffect(() => {
      onValidityChangeAction?.(false);
      onSubmitRefAction?.(() => undefined);
    }, [onValidityChangeAction, onSubmitRefAction]);
    return <div data-testid="rhf-form">RHF Form</div>;
  };
  UserFormRHF.displayName = 'UserFormRHF';

  return { __esModule: true, UserFormUncontrolled, UserFormRHF };
});

describe('UserForms', () => {
  it('should open and close uncontrolled dialog', async () => {
    const user = userEvent.setup();
    render(<UserForms />);
    await user.click(screen.getByRole('button', { name: /open uncontrolled form/i }));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should open RHF dialog with disabled submit and close it', async () => {
    const user = userEvent.setup();
    render(<UserForms />);
    await user.click(screen.getByRole('button', { name: /open react hook form/i }));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
