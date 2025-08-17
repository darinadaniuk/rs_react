import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { LocaleDropdown } from './locale-dropdown';

const mockPush = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
  useRouter: () => ({ push: mockPush }),
}));

describe('LocaleDropdown', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('should render current locale label', () => {
    render(<LocaleDropdown />);
    expect(
      screen.getByRole('button', { name: /english/i })
    ).toBeInTheDocument();
  });

  it('should open menu and switch locale on click', () => {
    render(<LocaleDropdown />);
    fireEvent.click(screen.getByRole('button', { name: /english/i }));
    const ruOption = screen.getByRole('button', { name: /русский/i });
    fireEvent.click(ruOption);
    expect(mockPush).toHaveBeenCalledWith('/ru/about');
  });
});
