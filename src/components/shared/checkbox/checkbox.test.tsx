import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';

import { Checkbox } from './checkbox';

describe('<Checkbox />', () => {
  it('should render without label', () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('should call onChange with true when initially unchecked and clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when initially checked and clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should toggle on Space key when focused (native behavior)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    const cb = screen.getByRole('checkbox');
    cb.focus();
    await user.keyboard('[Space]');
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} disabled />);
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeDisabled();
    await user.click(cb);
    cb.focus();
    await user.keyboard('[Space]');
    expect(handleChange).not.toHaveBeenCalled();
  });
});
