import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should have correct aria-checked when checked', () => {
    render(<Checkbox checked={true} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onChange with true when initially unchecked and clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when initially checked and clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={true} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should toggle on Enter key', () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole('checkbox'), { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should toggle on Space key', () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole('checkbox'), { key: ' ' });
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} disabled />);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.keyDown(screen.getByRole('checkbox'), { key: 'Enter' });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
