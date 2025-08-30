import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { Header } from './header';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      title: 'Rick & Morty DB',
      userIconAria: 'User',
      name: 'Darya',
    };
    return dict[key] ?? key;
  },
}));

const mockSetTheme = vi.fn();

vi.mock('@rs-react/context', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}));

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

vi.mock('@rs-react/components/client', () => ({
  Navigation: () => <nav data-testid="navigation" />,
  Toggle: ({ checked, onChange }: ToggleProps) => (
    <button data-testid="theme-toggle" aria-pressed={checked} onClick={() => onChange(!checked)}>
      toggle
    </button>
  ),
  LocaleDropdown: () => <div data-testid="locale-dropdown" />,
}));

describe('Header', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('should render title and user name', () => {
    render(<Header />);
    expect(screen.getByTestId('header-title')).toHaveTextContent('Rick & Morty DB');
    expect(screen.getByTestId('header-user')).toHaveTextContent('Darya');
  });

  it('should render navigation and locale dropdown', () => {
    render(<Header />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('locale-dropdown')).toBeInTheDocument();
  });

  it('should toggle theme to dark when toggle is clicked from light', () => {
    render(<Header />);
    const btn = screen.getByTestId('theme-toggle');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
