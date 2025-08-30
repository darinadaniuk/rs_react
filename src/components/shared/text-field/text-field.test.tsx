import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';

import { TextField } from './text-field';

describe('TextField', () => {
  it('should render with label and associate it to input via htmlFor when id is provided', () => {
    render(<TextField id="username" label="User Name" />);
    const label = screen.getByText('User Name');
    const input = screen.getByRole('textbox', { name: 'User Name' });
    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  it('should render without label when label is not provided', () => {
    render(<TextField />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render placeholder and type attributes', () => {
    render(<TextField placeholder="Type here" type="email" />);
    const input = screen.getByPlaceholderText('Type here');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should render datalist when listId and datalistOptions are provided', () => {
    render(<TextField listId="cities" datalistOptions={['Paris', 'Rome']} />);
    const list = screen.getByRole('listbox', { hidden: true });
    expect(list).toHaveAttribute('id', 'cities');
  });

  it('should not render datalist when listId is missing', () => {
    render(<TextField datalistOptions={['A', 'B']} />);
    expect(document.querySelector('datalist')).toBeNull();
  });

  it('should call onChange with typed value (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('hello');
  });

  it('should respect controlled value prop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<TextField value="a" onChange={onChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('a');
    await user.type(input, 'b');
    expect(onChange).toHaveBeenCalled();
    rerender(<TextField value="abc" onChange={onChange} />);
    expect(input.value).toBe('abc');
  });

  it('should set defaultValue for uncontrolled input', () => {
    render(<TextField defaultValue="start" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('start');
  });

  it('should set required, disabled, and readOnly attributes', () => {
    render(<TextField required disabled readOnly />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
  });

  it('should apply maxLength default and custom value', () => {
    render(<TextField />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxlength', '30');
  });

  it('should render error text and add invalid class', () => {
    const { container } = render(<TextField error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('invalid');
  });

  it('should render hint when no error', () => {
    render(<TextField hint="Helpful hint" />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('should not render hint when error exists', () => {
    render(<TextField hint="Helpful hint" error="Oops" />);
    expect(screen.queryByText('Helpful hint')).toBeNull();
  });

  it('should merge custom className with base class', () => {
    const { container } = render(<TextField className="extra" />);
    expect(container.firstChild).toHaveClass('text-field');
    expect(container.firstChild).toHaveClass('extra');
  });

  it('should forward ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
