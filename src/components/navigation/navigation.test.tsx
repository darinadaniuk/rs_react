import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { Navigation } from './navigation';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = { home: 'Home', about: 'About' };
    return dict[key] ?? key;
  },
}));

vi.mock('@rs-react/i18n/navigation', () => ({
  Link: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{props.children}</a>
  ),
}));

describe('Navigation', () => {
  it('should render navigation links with correct labels and hrefs', () => {
    render(<Navigation />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(homeLink).toHaveAttribute('href', '/cards');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
