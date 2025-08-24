import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Dialog, type DialogProps } from './dialog';

vi.mock('@rs-react/components', () => ({
  Button: (props: { text: string; onClick?: () => void; disabled?: boolean }) => (
    <button type="button" disabled={props.disabled} onClick={props.onClick}>
      {props.text}
    </button>
  ),
}));

function setup(props?: Partial<DialogProps>) {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  const defaultProps: DialogProps = {
    isOpen: true,
    title: 'My Dialog',
    children: <div>Dialog Content</div>,
    onClose,
    onSubmit,
    isSubmitDisabled: false,
  };

  return { ...render(<Dialog {...defaultProps} {...props} />), onClose, onSubmit };
}

beforeEach(() => {
  const host = document.createElement('div');
  host.setAttribute('id', 'dialog-root');
  document.body.appendChild(host);
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Dialog', () => {
  it('should not render when isOpen=false', () => {
    render(<Dialog isOpen={false} onClose={vi.fn()} />);
    expect(document.querySelector('.dialog-overlay')).toBeNull();
  });

  it('should render title and children when open', () => {
    setup();
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should mount into #dialog-root via portal', () => {
    setup();
    const host = document.getElementById('dialog-root')!;
    expect(host.querySelector('.dialog-overlay')).not.toBeNull();
  });

  it('should autofocus the dialog container on open', () => {
    setup();
    const dialogEl = document.querySelector('.dialog') as HTMLDivElement;
    expect(document.activeElement).toBe(dialogEl);
  });

  it('should call onClose when pressing Escape', () => {
    const { onClose } = setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking the overlay', async () => {
    const { onClose } = setup();
    const overlay = document.querySelector('.dialog-overlay') as HTMLDivElement;
    await userEvent.pointer([{ target: overlay, keys: '[MouseLeft]' }]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking inside the dialog content', async () => {
    const { onClose } = setup();
    const dialogBox = document.querySelector('.dialog') as HTMLDivElement;
    await userEvent.click(dialogBox);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when clicking the close button', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit when clicking submit', async () => {
    const { onSubmit } = setup();
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button when isSubmitDisabled=true', () => {
    setup({ isSubmitDisabled: true });
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeDisabled();
  });

  it('should render without a title', () => {
    setup({ title: undefined });
    const header = document.querySelector('.dialog-header') as HTMLDivElement;
    expect(header).toBeTruthy();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });
});
