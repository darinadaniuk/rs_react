import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { Toggle } from './toggle';

describe('<Toggle />', () => {
  it('should render without label', () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Toggle checked={false} label="Dark mode" onChange={() => {}} />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('should show the sun icon when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('should show the moon icon when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('should call onChange with correct value when toggled', () => {
    const handleChange = vi.fn();
    render(<Toggle checked={false} onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
