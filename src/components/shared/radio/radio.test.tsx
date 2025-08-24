import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Radio } from './radio';

describe('Radio', () => {
  it('should render with label text', () => {
    render(<Radio checked={false} value="opt1" label="Choice A" onChange={vi.fn()} />);
    expect(screen.getByText('Choice A')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Choice A' })).toBeInTheDocument();
  });

  it('should render without label when label prop is not provided', () => {
    render(<Radio checked={false} value="opt1" onChange={vi.fn()} />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('should apply checked class when checked=true', () => {
    const { container } = render(<Radio checked value="opt1" onChange={vi.fn()} />);
    const wrapper = container.querySelector('.custom-radio');
    if (!wrapper) throw new Error('Missing .custom-radio');
    expect(wrapper.classList.contains('checked')).toBe(true);
  });

  it('should apply disabled class when disabled=true', () => {
    const { container } = render(
      <Radio checked={false} disabled value="opt1" onChange={vi.fn()} />,
    );
    const wrapper = container.querySelector('.custom-radio');
    if (!wrapper) throw new Error('Missing .custom-radio');
    expect(wrapper.classList.contains('disabled')).toBe(true);
  });

  it('should pass name and value to the input', () => {
    render(
      <Radio checked={false} name="group1" value="opt1" label="Choice A" onChange={vi.fn()} />,
    );
    const radio = screen.getByRole('radio', { name: 'Choice A' }) as HTMLInputElement;
    expect(radio.name).toBe('group1');
    expect(radio.value).toBe('opt1');
  });

  it('should set required attribute when required=true', () => {
    render(<Radio checked={false} required value="opt1" label="Choice A" onChange={vi.fn()} />);
    const radio = screen.getByRole('radio', { name: 'Choice A' });
    expect(radio).toBeRequired();
  });

  it('should call onChange with value when toggled to checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio checked={false} value="opt1" label="Choice A" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Choice A' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('opt1');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio checked={false} disabled value="opt1" label="Choice A" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Choice A' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should merge custom className with base classes', () => {
    const { container } = render(
      <Radio checked={false} value="opt1" onChange={vi.fn()} className="extra-class" />,
    );
    const wrapper = container.querySelector('.custom-radio');
    if (!wrapper) throw new Error('Missing .custom-radio');
    expect(wrapper.classList.contains('extra-class')).toBe(true);
  });
});
