import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('should render with default "Click me" text', () => {
    render(<Button onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should render with input text', () => {
    render(<Button text="Test" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Test');
  });

  it('should apply class for default primary type', () => {
    render(<Button onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('should apply class for danger type', () => {
    render(<Button type="danger" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('danger');
  });

  it('should call onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
