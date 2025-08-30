import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

const h = vi.hoisted(() => ({
  mockStore: {
    data: {
      name: 'Darya',
      age: 30,
      email: 'd@example.com',
      gender: 'female',
      country: 'Canada',
      pictureBase64: 'iVBORw0Kabcdef',
    },
    reset: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => key,
}));

vi.mock('@rs-react/store', () => ({
  __esModule: true,
  useUserStore: <T,>(selector: (s: typeof h.mockStore) => T): T => selector(h.mockStore),
}));

import ProfileDialog from './profile-dialog';

import type { ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  title?: string;
  withReset?: boolean;
  onReset?: () => void;
  children?: ReactNode;
};

vi.mock('@rs-react/components', () => {
  const Dialog: React.FC<DialogProps> = ({ isOpen, title, withReset, onReset, children }) =>
    isOpen ? (
      <div data-testid="dialog">
        <div>{title}</div>
        {children}
        {withReset ? <button onClick={onReset}>Reset</button> : null}
      </div>
    ) : null;

  return { __esModule: true, Dialog };
});

describe('ProfileDialog', () => {
  it('renders profile and resets on click', async () => {
    const user = userEvent.setup();
    const onCloseAction = vi.fn();

    render(<ProfileDialog isOpen title="Profile" onCloseAction={onCloseAction} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Darya')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('d@example.com')).toBeInTheDocument();

    const img = screen.getByAltText('pictureAlt') as HTMLImageElement;
    expect(img.src).toContain('data:image/png;base64,');

    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(h.mockStore.reset).toHaveBeenCalledTimes(1);
    expect(onCloseAction).toHaveBeenCalledTimes(1);
  });
});
