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
    render(<Pagination total={3} currentPage={1} onPageChange={onChange} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('should highlight the current page', () => {
    render(<Pagination total={3} currentPage={2} onPageChange={onChange} />);

    const activeButton = screen.getByRole('button', { name: '2' });
    expect(activeButton).toHaveClass('active');
  });

  it('should disable Prev for the first page', () => {
    render(<Pagination total={3} currentPage={1} onPageChange={onChange} />);
    expect(screen.getByTestId('prev-button')).toBeDisabled();
  });

  it('should disable Next for the last page', () => {
    render(<Pagination total={3} currentPage={3} onPageChange={onChange} />);
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('should call onChange when page number is clicked', async () => {
    render(<Pagination total={3} currentPage={1} onPageChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange when Next is clicked', async () => {
    render(<Pagination total={3} currentPage={1} onPageChange={onChange} />);
    await userEvent.click(screen.getByTestId('next-button'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange when Prev is clicked', async () => {
    render(<Pagination total={3} currentPage={2} onPageChange={onChange} />);
    await userEvent.click(screen.getByTestId('prev-button'));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
