import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Pagination } from './pagination';

describe('Pagination', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all page buttons', () => {
    render(<Pagination total={3} currentPage={1} onChange={onChange} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('should highlight the current page', () => {
    render(<Pagination total={3} currentPage={2} onChange={onChange} />);

    const activeButton = screen.getByRole('button', { name: '2' });
    expect(activeButton).toHaveClass('active');
  });

  it('should disable Prev for the first page', () => {
    render(<Pagination total={3} currentPage={1} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled();
  });

  it('should disable Next for the last page', () => {
    render(<Pagination total={3} currentPage={3} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('should call onChange when page number is clicked', async () => {
    render(<Pagination total={3} currentPage={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange when Next is clicked', async () => {
    render(<Pagination total={3} currentPage={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange when Prev is clicked', async () => {
    render(<Pagination total={3} currentPage={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Prev' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
